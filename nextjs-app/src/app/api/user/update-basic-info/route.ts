import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { basicInfoSchema } from "@/types/basicInfo.schema";

export async function POST(req: Request) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          details: "You must be logged in to update basic info"
        },
        { status: 401 }
      );
    }

    userId = session.user.id;
    const body = await req.json();

    try {
      basicInfoSchema.parse(body);
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

    // Optimize data transformation
    const updateData: {
      name?: string;
      bio?: string | null;
      portfolio?: string | null;
      linkedin?: string | null;
      github?: string | null;
    } = {};

    if (body.name !== undefined) updateData.name = body.name?.trim() || "";
    if (body.bio !== undefined) updateData.bio = body.bio?.trim() || null;
    if (body.portfolio !== undefined) updateData.portfolio = body.portfolio?.trim() || null;
    if (body.linkedin !== undefined) updateData.linkedin = body.linkedin?.trim() || null;
    if (body.github !== undefined) updateData.github = body.github?.trim() || null;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const processingTime = Date.now() - startTime;
    console.log(`Basic info updated successfully for user ${userId}:`, {
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
      fieldsUpdated: Object.keys(updateData)
    });

    return NextResponse.json(
      {
        success: true,
        message: "Basic info updated successfully",
        data: {
          name: user.name,
          bio: user.bio,
          portfolio: user.portfolio,
          linkedin: user.linkedin,
          github: user.github,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Failed to update basic info for user ${userId || 'unknown'}:`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : String(error),
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
      userId: userId || 'unknown'
    });

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        details: "An unexpected error occurred while updating basic info"
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, bio, linkedin, github, portfolio, image } = body;

    const updateData: {
      name?: string;
      bio?: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
      image?: string;
    } = {};

    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (github !== undefined) updateData.github = github;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (image !== undefined) updateData.image = image;

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "User information updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user information:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user information" },
      { status: 500 }
    );
  }
}

