import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    // Update user basic info if provided
    if (body.user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: body.user.name,
          bio: body.user.bio,
          portfolio: body.user.portfolio,
          linkedin: body.user.linkedin,
          github: body.user.github,
        },
      });
    }

    // Handle projects if provided
    if (body.projects && Array.isArray(body.projects)) {
      for (const project of body.projects) {
        await prisma.project.create({
          data: {
            title: project.title,
            description: project.description,
            startDate: new Date(project.startDate),
            endDate: project.endDate ? new Date(project.endDate) : null,
            url: project.url,
            technologies: project.technologies || [],
            userId: user.id,
          },
        });
      }
    }

    // Handle experiences if provided
    if (body.experiences && Array.isArray(body.experiences)) {
      for (const experience of body.experiences) {
        await prisma.experience.create({
          data: {
            title: experience.title,
            company: experience.company,
            description: experience.description,
            startDate: new Date(experience.startDate),
            endDate: experience.endDate ? new Date(experience.endDate) : null,
            current: experience.current || false,
            location: experience.location,
            userId: user.id,
          },
        });
      }
    }

    // Handle education if provided
    if (body.education && Array.isArray(body.education)) {
      for (const education of body.education) {
        await prisma.education.create({
          data: {
            institution: education.institution,
            degree: education.degree,
            field: education.field,
            startDate: new Date(education.startDate),
            endDate: education.endDate ? new Date(education.endDate) : null,
            current: education.current || false,
            userId: user.id,
          },
        });
      }
    }

    // Handle skills if provided
    if (body.skills && Array.isArray(body.skills)) {
      for (const skill of body.skills) {
        await prisma.skill.create({
          data: {
            name: skill.name,
            category: skill.category,
            level: skill.level,
            yearsOfExperience: skill.yearsOfExperience || 0,
            userId: user.id,
          },
        });
      }
    }

    // Handle certifications if provided
    if (body.certifications && Array.isArray(body.certifications)) {
      for (const certification of body.certifications) {
        await prisma.certification.create({
          data: {
            title: certification.title,
            issuer: certification.issuer,
            description: certification.description,
            issueDate: new Date(certification.issueDate),
            expiryDate: certification.expiryDate ? new Date(certification.expiryDate) : null,
            credentialUrl: certification.credentialUrl,
            userId: user.id,
          },
        });
      }
    }

    return NextResponse.json({ message: "Data added successfully" });
  } catch (error) {
    console.error("Error adding user data:", error);
    return NextResponse.json(
      { error: "Failed to add user data" },
      { status: 500 }
    );
  }
} 