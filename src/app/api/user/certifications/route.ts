import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        certifications: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { title, issuer, description, issueDate, expiryDate, credentialUrl } = body;

    if (!title || !issuer || !issueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const certification = await prisma.certification.create({
        data: {
          title,
          issuer,
          description,
          issueDate: new Date(issueDate),
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          credentialUrl,
          userId: user.id,
        },
      });

      return NextResponse.json({ success: true, data: certification });
    } catch (dbError) {
      console.error("Database error creating certification:", dbError);
      return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, issuer, description, issueDate, expiryDate, credentialUrl } = body;

    if (!id || !title || !issuer || !issueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const certification = await prisma.certification.update({
        where: { id },
        data: {
          title,
          issuer,
          description,
          issueDate: new Date(issueDate),
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          credentialUrl,
        },
      });

      return NextResponse.json({ success: true, data: certification });
    } catch (dbError) {
      console.error("Database error updating certification:", dbError);
      return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating certification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Certification ID is required" }, { status: 400 });
    }

    try {
      await prisma.certification.delete({
        where: { id },
      });

      return NextResponse.json({ success: true, message: "Certification deleted successfully" });
    } catch (dbError) {
      console.error("Database error deleting certification:", dbError);
      return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 