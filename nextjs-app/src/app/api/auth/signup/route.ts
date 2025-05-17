import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';
import { userSchema } from '@/types/signup.schema';

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  try {
    userSchema.parse({ email, password, name });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ message: error.errors.map(err => err.message) }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: "An unexpected error occurred" }), { status: 500 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  const { password: _, ...userWithoutPassword } = newUser;

  return new Response(JSON.stringify({ message: "User created successfully", user: userWithoutPassword }), { status: 201 });
}

