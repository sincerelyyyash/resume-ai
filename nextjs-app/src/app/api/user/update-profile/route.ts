import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { profileUpdateSchema } from "@/types/profile.schema";
import { apiSecurity } from "@/middleware/api-security";

export async function POST(req: NextRequest) {
  try {
    // Apply security measures
    const securityResponse = await apiSecurity(req, profileUpdateSchema);
    if (securityResponse) return securityResponse;

    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          details: "You must be logged in to update profile",
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { name, bio, portfolio, linkedin, github, image } = body;

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        portfolio,
        linkedin,
        github,
        image,
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
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
