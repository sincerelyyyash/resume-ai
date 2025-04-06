import dbConnect from "@/lib/mongoDbConnect";
import { ZodError, z } from "zod";
import User from "@/models/user.model";

const partialFormSchema = z.object({
  userId: z.string(),
  projects: z.optional(z.array(z.any())),
  educations: z.optional(z.array(z.any())),
  experiences: z.optional(z.array(z.any())),
  skills: z.optional(z.array(z.any())),
});

export async function PATCH(req: Request) {
  let body;

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ message: "Invalid JSON" }), { status: 400 });
  }

  try {
    partialFormSchema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ message: error.errors.map((err) => err.message) }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: "Unexpected validation error" }), { status: 500 });
  }

  const { userId, projects, educations, experiences, skills } = body;

  await dbConnect();

  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  try {
    if (projects) user.projects = projects;
    if (educations) user.education = educations;
    if (experiences) user.experiences = experiences;
    if (skills) user.skills = skills;

    await user.save();
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error saving user data", error }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify({ message: "Profile updated successfully" }), { status: 200 });
}
