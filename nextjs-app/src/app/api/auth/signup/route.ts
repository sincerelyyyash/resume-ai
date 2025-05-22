import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';
import { userSchema } from '@/types/signup.schema';

function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const rest = { ...obj };
  delete rest[key];
  return rest;
}

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  try {
    userSchema.parse({ email, password, name });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({ message: error.errors.map(err => err.message) }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({ message: "An unexpected error occurred" }),
      { status: 500 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ message: "User already exists" }),
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  return new Response(
    JSON.stringify({
      message: "User created successfully",
      user: omit(newUser, 'password')
    }),
    { status: 201 }
  );
}
