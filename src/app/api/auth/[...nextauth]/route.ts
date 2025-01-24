import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import mongoose from 'mongoose';
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

        await dbConnect();

        const credentialsSchema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        });

        try {
          credentialsSchema.parse(credentials);
        } catch (error) {
          throw new Error('Invalid credentials format');
        }

        const user = await User.findOne({ email: credentials.email }) as UserDocument;
        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
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
          const userId = new mongoose.Types.ObjectId(token.sub);
          const user = await User.findById(userId) as UserDocument;
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

const handler: NextApiHandler = NextAuth(authOptions);

export { handler as GET, handler as POST };
