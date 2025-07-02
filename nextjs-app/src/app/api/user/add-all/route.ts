import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { resumeDataSchema, type ResumeData } from "@/types/resume-upload.schema";
import { apiSecurity } from "@/middleware/api-security";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Apply security measures
    const securityResponse = await apiSecurity(req, resumeDataSchema);
    if (securityResponse) return securityResponse;

    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: "Authentication required",
        message: "You must be logged in to update profile data"
      }, { status: 401 });
    }

    userId = session.user.id;

    // Parse and validate request body
    let body: ResumeData;
    try {
      const rawBody = await req.json();
      body = resumeDataSchema.parse(rawBody);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json({
          success: false,
          error: "Invalid data format",
          message: "The provided data format is invalid",
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }, { status: 400 });
      }
      return NextResponse.json({
        success: false,
        error: "Invalid request body"
      }, { status: 400 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        message: "The authenticated user could not be found"
      }, { status: 404 });
    }

    // Process data in a single transaction for data consistency
    const result = await prisma.$transaction(async (tx) => {
      const counters = {
        userUpdates: 0,
        projects: 0,
        experiences: 0,
        education: 0,
        skills: 0,
        certifications: 0
      };

      // Update user basic info if provided
      if (body.user && Object.keys(body.user).length > 0) {
        const updateData: {
          name?: string;
          bio?: string;
          portfolio?: string;
          linkedin?: string;
          github?: string;
        } = {};

        if (body.user.name?.trim()) updateData.name = body.user.name.trim();
        if (body.user.bio !== undefined) updateData.bio = body.user.bio?.trim() || "";
        if (body.user.portfolio !== undefined) updateData.portfolio = body.user.portfolio?.trim() || "";
        if (body.user.linkedin !== undefined) updateData.linkedin = body.user.linkedin?.trim() || "";
        if (body.user.github !== undefined) updateData.github = body.user.github?.trim() || "";

        if (Object.keys(updateData).length > 0) {
          await tx.user.update({
            where: { id: userId },
            data: updateData,
          });
          counters.userUpdates = 1;
        }
      }

      // Clear existing data to replace with new data
      await Promise.all([
        tx.project.deleteMany({ where: { userId } }),
        tx.experience.deleteMany({ where: { userId } }),
        tx.education.deleteMany({ where: { userId } }),
        tx.skill.deleteMany({ where: { userId } }),
        tx.certification.deleteMany({ where: { userId } })
      ]);

      // Create projects
      if (body.projects && body.projects.length > 0) {
        const projectsData = body.projects.map((project: ResumeData['projects'][0]) => ({
          title: project.title.trim(),
          description: project.description.trim(),
          startDate: new Date(project.startDate),
          endDate: project.endDate ? new Date(project.endDate) : null,
          url: project.url?.trim() || null,
          technologies: project.technologies || [],
          userId: userId!,
        }));

        await tx.project.createMany({
          data: projectsData,
          skipDuplicates: false,
        });
        counters.projects = projectsData.length;
      }

      // Create experiences
      if (body.experiences && body.experiences.length > 0) {
        const experiencesData = body.experiences.map((experience: ResumeData['experiences'][0]) => ({
          title: experience.title.trim(),
          company: experience.company.trim(),
          description: experience.description.trim(),
          startDate: new Date(experience.startDate),
          endDate: experience.endDate ? new Date(experience.endDate) : null,
          current: experience.current || false,
          location: experience.location?.trim() || null,
          userId: userId!,
        }));

        await tx.experience.createMany({
          data: experiencesData,
          skipDuplicates: false,
        });
        counters.experiences = experiencesData.length;
      }

      // Create education
      if (body.education && body.education.length > 0) {
        const educationData = body.education.map((education: ResumeData['education'][0]) => ({
          institution: education.institution.trim(),
          degree: education.degree.trim(),
          field: education.field.trim(),
          startDate: new Date(education.startDate),
          endDate: education.endDate ? new Date(education.endDate) : null,
          current: education.current || false,
          userId: userId!,
        }));

        await tx.education.createMany({
          data: educationData,
          skipDuplicates: false,
        });
        counters.education = educationData.length;
      }

      // Create skills
      if (body.skills && body.skills.length > 0) {
        const skillsData = body.skills.map((skill: ResumeData['skills'][0]) => ({
          name: skill.name.trim(),
          category: skill.category.trim(),
          level: skill.level || "Intermediate",
          yearsOfExperience: skill.yearsOfExperience || 0,
          userId: userId!,
        }));

        await tx.skill.createMany({
          data: skillsData,
          skipDuplicates: false,
        });
        counters.skills = skillsData.length;
      }

      // Create certifications
      if (body.certifications && body.certifications.length > 0) {
        const certificationsData = body.certifications.map((certification: ResumeData['certifications'][0]) => ({
          title: certification.title.trim(),
          issuer: certification.issuer.trim(),
          description: certification.description?.trim() || null,
          issueDate: new Date(certification.issueDate),
          expiryDate: certification.expiryDate ? new Date(certification.expiryDate) : null,
          credentialUrl: certification.credentialUrl?.trim() || null,
          userId: userId!,
        }));

        await tx.certification.createMany({
          data: certificationsData,
          skipDuplicates: false,
        });
        counters.certifications = certificationsData.length;
      }

      return counters;
    });

    // Log successful operation
    const processingTime = Date.now() - startTime;
    console.log(`Profile data updated successfully for user ${userId}:`, {
      ...result,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "Profile data updated successfully",
      data: {
        saved: result,
        summary: `Updated profile with ${result.projects} projects, ${result.experiences} experiences, ${result.education} education entries, ${result.skills} skills, and ${result.certifications} certifications.`
      }
    }, { status: 200 });

  } catch (error) {
    // Log errors with context
    const processingTime = Date.now() - startTime;
    console.error(`Failed to update profile data for user ${userId || 'unknown'}:`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : String(error),
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
      userId: userId || 'unknown'
    });

    return NextResponse.json({
      success: false,
      error: "Failed to update profile data",
      message: "An error occurred while updating your profile data. Please try again."
    }, { status: 500 });
  }
} 