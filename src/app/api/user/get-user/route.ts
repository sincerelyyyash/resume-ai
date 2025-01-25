
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
      JSON.stringify({ message: "Invalid JSON format in request body" }),
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
          message: error.errors.map((err) => err.message),
        }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({ message: "An unexpected error occurred" }),
      { status: 500 }
    );
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return new Response(
      JSON.stringify({ message: "User not found" }),
      { status: 404 }
    );
  }

  const userData = {
    id: user._id,
    email: user.email,
    name: user.name,
    projects: user.projects,
    experiences: user.experiences,
    skills: user.skills,
    education: user.education,
    savedResumes: user.savedResumes,
    jobDescriptions: user.jobDescriptions,
  };

  return new Response(
    JSON.stringify({ message: "User data fetched successfully", user: userData }),
    { status: 200 }
  );
}
