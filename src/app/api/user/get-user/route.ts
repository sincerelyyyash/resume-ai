import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          details: "You must be logged in to access user data"
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        projects: true,
        experiences: true,
        skills: true,
        education: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          details: "The authenticated user could not be found in the database"
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User data retrieved successfully",
        data: user
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        details: "An unexpected error occurred while fetching user data"
      },
      { status: 500 }
    );
  }
}

