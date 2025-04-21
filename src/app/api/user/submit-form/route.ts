import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { formSchema } from "@/types/form.schema";

export async function POST(req: Request) {
  const { userId, projects, educations, experiences, skills } = await req.json();

  try {
    formSchema.parse({ userId, projects, educations, experiences, skills });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ message: error.errors.map((err) => err.message) }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: "An unexpected error occurred" }), { status: 500 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  try {
    // Delete existing related records
    await prisma.$transaction([
      prisma.project.deleteMany({ where: { userId } }),
      prisma.education.deleteMany({ where: { userId } }),
      prisma.experience.deleteMany({ where: { userId } }),
      prisma.skill.deleteMany({ where: { userId } }),
    ]);

    // Create new records
    await prisma.$transaction([
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
  } catch (error) {
    return new Response(JSON.stringify({ message: "An unexpected error occurred while saving data", error }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: "Profile data updated successfully" }), { status: 200 });
}

