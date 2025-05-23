import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          details: "You must be logged in to check profile completion status"
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

    const completionStatus = {
      basicInfo: Boolean(user.name && user.email),
      projects: user.projects.some(project => 
        Boolean(project.title && project.description)
      ),
      experiences: user.experiences.some(exp => 
        Boolean(exp.company && exp.title && exp.startDate)
      ),
      skills: user.skills.some(skill => 
        Boolean(skill.name && skill.level)
      ),
      education: user.education.some(edu => 
        Boolean(edu.institution && edu.degree && edu.startDate)
      ),
    };

    const totalSteps = 5;
    const completedSteps = Object.values(completionStatus).filter(Boolean).length;
    const completionPercentage = (completedSteps / totalSteps) * 100;

    return NextResponse.json(
      {
        success: true,
        message: "Profile completion status retrieved successfully",
        data: {
          status: completionStatus,
          completionPercentage,
          completedSteps,
          totalSteps,
          missingFields: Object.entries(completionStatus)
            .filter(([_, value]) => !value)
            .map(([key]) => key)
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking profile completion status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        details: "An unexpected error occurred while checking profile completion status"
      },
      { status: 500 }
    );
  }
}
