import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, level, category } = body;

    const skill = await prisma.skill.create({
      data: {
        name,
        level,
        category,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Skill added successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Error adding skill:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add skill" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, name, category, level, yearsOfExperience } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Skill ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (level !== undefined) updateData.level = level;
    if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;

    const skill = await prisma.skill.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update skill" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Skill ID is required" },
        { status: 400 }
      );
    }

    await prisma.skill.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete skill" },
      { status: 500 }
    );
  }
} 