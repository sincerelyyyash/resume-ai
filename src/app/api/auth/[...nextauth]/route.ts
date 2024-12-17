import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import NextAuth, { AuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import dbConnect from '@/lib/mongoDbConnect';
import User, { UserDocument } from '@/models/user.model';
import { NextApiHandler } from 'next';

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
      role?: string;
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
        email: { label: 'Email', type: 'text', placeholder: 'email@example.com', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        await dbConnect();

        const credentialsSchema = z.object({
          email: z.string().email({ message: 'Invalid email address' }),
          password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
        });

        try {
          credentialsSchema.parse(credentials);
        } catch (error) {
          return null;
        }

        const existingUser = await User.findOne({ email: credentials.email }) as UserDocument;
        if (!existingUser) return null;

        const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
        if (!passwordValidation) return null;

        return {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          bio: existingUser.bio,
          portfolio: existingUser.portfolio,
          linkedin: existingUser.linkedin,
          github: existingUser.github,
        } as NextAuthUser;
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
        const user = await User.findById(token.sub) as UserDocument;
        if (user) {
          session.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            bio: user.bio,
            portfolio: user.portfolio,
            linkedin: user.linkedin,
            github: user.github,
          };
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

const handler: NextApiHandler = NextAuth(authOptions);

export { handler as GET, handler as POST };
