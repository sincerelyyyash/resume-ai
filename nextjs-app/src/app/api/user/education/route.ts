import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
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
    const { institution, degree, field, startDate, endDate, current } = body;

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

    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        field,
        startDate: startDateObj,
        endDate: endDateObj,
        current: current || false,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Education added successfully",
      data: education,
    });
  } catch (error) {
    console.error("Error adding education:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add education" },
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
    const { id, institution, degree, field, startDate, endDate, current } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Education ID is required" },
        { status: 400 }
      );
    }

    const updateData: {
      institution?: string;
      degree?: string;
      field?: string;
      current?: boolean;
      startDate?: Date;
      endDate?: Date | null;
    } = {};

    if (institution !== undefined) updateData.institution = institution;
    if (degree !== undefined) updateData.degree = degree;
    if (field !== undefined) updateData.field = field;
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
      if (endDate && isNaN(endDateObj!.getTime())) {
        return NextResponse.json(
          { success: false, message: "Invalid end date" },
          { status: 400 }
        );
      }
      updateData.endDate = endDateObj;
      updateData.current = !endDate;
    }

    const education = await prisma.education.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Education updated successfully",
      data: education,
    });
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update education" },
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
        { success: false, message: "Education ID is required" },
        { status: 400 }
      );
    }

    await prisma.education.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete education" },
      { status: 500 }
    );
  }
} 