import dbConnect from "@/lib/mongoDbConnect";
import User from "@/models/user.model";
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

  await dbConnect();

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

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
  }

  const totalSections = 6;
  let completedSections = 0;

  if (user.name) completedSections++;
  if (user.email) completedSections++;
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
