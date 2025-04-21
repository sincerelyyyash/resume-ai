import { prisma } from "@/lib/prisma";
import { userIdSchema } from "@/types/userId.schema";
import { ZodError } from "zod";
import { User, UserResponse, Project, Experience, Skill, Education } from "@/types/prisma.types";

export async function POST(req: Request) {
  let userId: string;
  try {
    const body = await req.json();
    userId = body.userId;
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: "Invalid JSON format in request body" }),
      { status: 400 }
    );
  }

  try {
    userIdSchema.parse({ userId });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Validation failed",
          errors: error.errors.map((err) => err.message),
        }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({ status: "error", message: "An unexpected error occurred" }),
      { status: 500 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        projects: true,
        experiences: true,
        skills: true,
        education: true,
        savedResumes: true,
        jobDescriptions: true,
      }
    }) as User | null;

    if (!user) {
      return new Response(
        JSON.stringify({ status: "error", message: "User not found" }),
        { status: 404 }
      );
    }

    const { password, ...userWithoutPassword } = user;

    const structuredResponse: UserResponse = {
      status: "success",
      message: "User data fetched successfully",
      data: {
        personalInfo: {
          email: userWithoutPassword.email,
          name: userWithoutPassword.name,
          bio: userWithoutPassword.bio,
          linkedin: userWithoutPassword.linkedin,
          github: userWithoutPassword.github,
          image: userWithoutPassword.image,
        },
        projects: userWithoutPassword.projects.map((project: Project) => ({
          title: project.title,
          description: project.description,
          url: project.url,
          startDate: project.startDate,
          endDate: project.endDate,
        })),
        experiences: userWithoutPassword.experiences.map((experience: Experience) => ({
          title: experience.title,
          company: experience.company,
          startDate: experience.startDate,
          endDate: experience.endDate,
          description: experience.description,
          location: experience.company,
        })),
        skills: userWithoutPassword.skills.map((skill: Skill) => ({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          yearsOfExperience: skill.yearsOfExperience,
        })),
        education: userWithoutPassword.education.map((edu: Education) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
        })),
        savedResumes: userWithoutPassword.savedResumes,
        jobDescriptions: userWithoutPassword.jobDescriptions,
      },
    };

    return new Response(JSON.stringify(structuredResponse), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: "An unexpected error occurred" }),
      { status: 500 }
    );
  }
}

