import dbConnect from "@/lib/mongoDbConnect";
import { ZodError } from "zod";
import User from "@/models/user.model";
import { formSchema } from "@/types/profile-form";

export async function POST(req: Request) {
  const { userId, projects, educations, experiences, skills } = await req.json();

  await dbConnect();
  try {
    formSchema.parse({ userId, projects, educations, experiences, skills });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ message: error.errors.map((err) => err.message) }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: "An unexpected error occurred" }), { status: 500 });
  }

  const user = await User.findById(userId);

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  try {
    user.projects = projects;
    user.education = educations;
    user.experiences = experiences;
    user.skills = skills;
    await user.save();
  } catch (error) {
    return new Response(JSON.stringify({ message: "An unexpected error occurred while saving data", error }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Profile data updated successfully" }), { status: 200 });
}

