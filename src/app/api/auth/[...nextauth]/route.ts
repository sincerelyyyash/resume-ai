import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { credentialsSchema } from "@/types/signin.schema";

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      bio?: string;
      portfolio?: string;
      linkedin?: string;
      github?: string;
    };
  }
}

const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          credentialsSchema.parse(credentials);
        } catch (error) {
          throw new Error('Invalid credentials format');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          portfolio: user.portfolio,
          linkedin: user.linkedin,
          github: user.github,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'secret',
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async session({ token, session }) {
      if (token?.sub) {
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub }
          });

          if (user) {
            session.user = {
              id: user.id,
              name: user.name,
              email: user.email,
              bio: user.bio,
              portfolio: user.portfolio,
              linkedin: user.linkedin,
              github: user.github,
            };
          }
        } catch (error) {
          console.error("Error finding user by ID:", error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
