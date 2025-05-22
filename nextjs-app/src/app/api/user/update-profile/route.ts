import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";

import { ZodError } from "zod";
import { profileSchema } from "@/types/profile.schema";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          details: "You must be logged in to update profile"
        },
        { status: 401 }
      );
    }

    const body = await req.json();

    try {
      profileSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          details: "An unexpected validation error occurred"
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        bio: body.bio,
        portfolio: body.portfolio,
        linkedin: body.linkedin,
        github: body.github,
        image: body.image,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: {
          name: user.name,
          bio: user.bio,
          portfolio: user.portfolio,
          linkedin: user.linkedin,
          github: user.github,
          image: user.image,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        details: "An unexpected error occurred while updating profile"
      },
      { status: 500 }
    );
  }
}
