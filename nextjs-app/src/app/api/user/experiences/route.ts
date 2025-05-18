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
    const { title, company, description, startDate, endDate, location } = body;

    // Validate startDate
    const startDateObj = startDate ? new Date(startDate) : null;
    if (!startDateObj || isNaN(startDateObj.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid start date" },
        { status: 400 }
      );
    }

    // Validate endDate if provided
    let endDateObj = null;
    if (endDate) {
      endDateObj = new Date(endDate);
      if (isNaN(endDateObj.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid end date" },
          { status: 400 }
        );
      }
    }

    const experience = await prisma.experience.create({
      data: {
        title,
        company,
        description,
        startDate: startDateObj,
        endDate: endDateObj,
        location,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Experience added successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Error adding experience:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add experience" },
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
    const { id, title, company, description, startDate, endDate, location, current } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Experience ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (company !== undefined) updateData.company = company;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (current !== undefined) updateData.current = current;

    // Handle dates only if they are provided
    if (startDate) {
      const startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid start date" },
          { status: 400 }
        );
      }
      updateData.startDate = startDateObj;
    }

    if (endDate !== undefined) {
      const endDateObj = endDate ? new Date(endDate) : null;
      if (endDate && isNaN(endDateObj.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid end date" },
          { status: 400 }
        );
      }
      updateData.endDate = endDateObj;
      updateData.current = !endDate;
    }

    const experience = await prisma.experience.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update experience" },
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
        { success: false, message: "Experience ID is required" },
        { status: 400 }
      );
    }

    await prisma.experience.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete experience" },
      { status: 500 }
    );
  }
} 