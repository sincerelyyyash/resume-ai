import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FEEDBACK_DIR = path.join(process.cwd(), "feedback");

// Ensure the feedback directory exists
if (!fs.existsSync(FEEDBACK_DIR)) {
  fs.mkdirSync(FEEDBACK_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const timestamp = new Date().toISOString();
    const fileName = `${timestamp}-${data.type}-${data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}.md`;

    const markdownContent = `# ${data.title}

**Type:** ${data.type === "bug" ? "Bug Report" : "Feature Request"}
**Priority:** ${data.priority}
**Date:** ${timestamp}
${data.email ? `**Contact:** ${data.email}` : ""}

## Description

${data.description}
`;

    fs.writeFileSync(path.join(FEEDBACK_DIR, fileName), markdownContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
} 