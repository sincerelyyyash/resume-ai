import { prisma } from "@/lib/prisma";
import { ZodError, z } from "zod";

const userInfoSchema = z.object({
  userId: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  bio: z.string().optional(),
  portfolio: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
});

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ message: "Invalid JSON format in request body" }),
      { status: 400 }
    );
  }

  try {
    const parsedData = userInfoSchema.parse(body);
    const { userId, ...fieldsToUpdate } = parsedData;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404 }
      );
    }

    // Filter out undefined values
    const updateData = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined)
    );

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return new Response(
      JSON.stringify({ message: "User info updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({ message: error.errors.map(err => err.message) }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ message: "An unexpected error occurred", error }),
      { status: 500 }
    );
  }
}

