
import dbConnect from '@/lib/mongoDbConnect';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';
import User from '@/models/user.model';
import { userSchema } from '@/types/signup.schema';

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  await dbConnect();

  try {
    userSchema.parse({ email, password, name });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ message: error.errors.map(err => err.message) }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: "An unexpected error occurred" }), { status: 500 });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  const { password: _, ...userWithoutPassword } = newUser.toObject();

  return new Response(JSON.stringify({ message: "User created successfully", user: userWithoutPassword }), { status: 201 });
}

