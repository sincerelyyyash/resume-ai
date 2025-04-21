import { prisma } from "@/lib/prisma";
import { userIdSchema } from "@/types/userId.schema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  let userId;
  try {
    const body = await req.json();
    userId = body.userId;
  } catch {
    return new Response(JSON.stringify({ message: "Invalid JSON body" }), { status: 400 });
  }

  try {
    userIdSchema.parse({ userId });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({ message: error.errors.map((e) => e.message) }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify({ message: "Unexpected error" }), { status: 500 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      education: true,
      projects: true,
      skills: true,
      experiences: true,
    }
  });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  const totalSections = 9;
  let completedSections = 0;

  if (user.bio) completedSections++
  if (user.portfolio) completedSections++
  if (user.linkedin) completedSections++
  if (user.github) completedSections++
  if (user.image) completedSections++
  if (user.education?.length > 0) completedSections++;
  if (user.projects?.length > 0) completedSections++;
  if (user.skills?.length > 0) completedSections++;
  if (user.experiences?.length > 0) completedSections++;

  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  return new Response(
    JSON.stringify({
      message: "Profile completion calculated",
      completion: completionPercentage,
    }),
    { status: 200 }
  );
}
