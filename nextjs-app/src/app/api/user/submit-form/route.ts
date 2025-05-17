import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { formSchema } from "@/types/form.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the authenticated user from the session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { 
          success: false,
          message: "Authentication required",
          details: "You must be logged in to submit form data"
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { projects, educations, experiences, skills } = await req.json();

    // Validate the form data
    try {
      formSchema.parse({ userId, projects, educations, experiences, skills });
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

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
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

    // Delete existing records and create new ones in a transaction
    try {
      await prisma.$transaction([
        // Delete existing records
        prisma.project.deleteMany({ where: { userId } }),
        prisma.education.deleteMany({ where: { userId } }),
        prisma.experience.deleteMany({ where: { userId } }),
        prisma.skill.deleteMany({ where: { userId } }),
        
        // Create new records
        prisma.project.createMany({
          data: projects.map((project: any) => ({
            ...project,
            userId,
          })),
        }),
        prisma.education.createMany({
          data: educations.map((education: any) => ({
            ...education,
            userId,
          })),
        }),
        prisma.experience.createMany({
          data: experiences.map((experience: any) => ({
            ...experience,
            userId,
          })),
        }),
        prisma.skill.createMany({
          data: skills.map((skill: any) => ({
            ...skill,
            userId,
          })),
        }),
      ]);

      return NextResponse.json(
        { 
          success: true,
          message: "Profile data updated successfully",
          details: {
            projects: projects.length,
            educations: educations.length,
            experiences: experiences.length,
            skills: skills.length
          }
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Database transaction error:", error);
      return NextResponse.json(
        { 
          success: false,
          message: "Database error",
          details: "Failed to update profile data. Please try again later."
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Server error",
        details: "An unexpected error occurred while processing your request"
      },
      { status: 500 }
    );
  }
}

