
import User from "@/models/user.model";
import dbConnect from "@/lib/mongoDbConnect";
import { userIdSchema } from "@/types/userId.schema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  let userId;
  try {
    const body = await req.json();
    userId = body.userId;
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", message: "Invalid JSON format in request body" }),
      { status: 400 }
    );
  }

  await dbConnect();

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
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return new Response(
        JSON.stringify({ status: "error", message: "User not found" }),
        { status: 404 }
      );
    }

    const structuredResponse = {
      status: "success",
      message: "User data fetched successfully",
      data: {
        personalInfo: {
          // id: user._id,
          email: user.email,
          name: user.name,
          bio: user.bio,
          linkedin: user.linkedin,
          github: user.github,
          image: user.image,
        },
        projects: user.projects.map((project) => ({
          name: project.name,
          technologies: project.technologies,
          url: project.url,
          startDate: project.startDate,
          endDate: project.endDate,
          achievements: project.achievements,
        })),
        experiences: user.experiences.map((experience) => ({
          jobTitle: experience.jobTitle,
          company: experience.company,
          startDate: experience.startDate,
          endDate: experience.endDate,
          description: experience.description,
          location: experience.location,
        })),
        skills: user.skills.map((skill) => ({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          yearsOfExperience: skill.yearsOfExperience,
        })),
        education: user.education.map((edu) => ({
          institution: edu.institution,
          degree: edu.degree,
          startDate: edu.startDate,
          endDate: edu.endDate,
        })),
        savedResumes: user.savedResumes,
        jobDescriptions: user.jobDescriptions,
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

