import { prisma } from "@/lib/prisma";
import { ZodError, z } from "zod";

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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      projects: true,
      education: true,
      experiences: true,
      skills: true,
    }
  });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  try {
    if (projects) {
      await prisma.project.createMany({
        data: projects.map((project: any) => ({
          ...project,
          userId,
        })),
      });
    }

    if (educations) {
      await prisma.education.createMany({
        data: educations.map((education: any) => ({
          ...education,
          userId,
        })),
      });
    }

    if (experiences) {
      await prisma.experience.createMany({
        data: experiences.map((experience: any) => ({
          ...experience,
          userId,
        })),
      });
    }

    if (skills) {
      const existingSkills = user.skills;
      const newSkills = skills.reduce((acc: any[], skill: any) => {
        const existingCategory = acc.find(s => s.category === skill.category);
        if (existingCategory) {
          existingCategory.items = [...new Set([...existingCategory.items, ...skill.items])];
        } else {
          acc.push(skill);
        }
        return acc;
      }, [...existingSkills]);

      // Delete existing skills and create new ones
      await prisma.$transaction([
        prisma.skill.deleteMany({ where: { userId } }),
        prisma.skill.createMany({
          data: newSkills.map((skill: any) => ({
            ...skill,
            userId,
          })),
        }),
      ]);
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error saving user data", error }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify({ message: "Profile updated successfully" }), { status: 200 });
}
