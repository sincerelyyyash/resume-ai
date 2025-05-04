import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Readable } from "stream";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { Document } from "docx";

async function parsePDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}

async function parseDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function extractName(text: string): string {
  // Look for the first line that's not empty and doesn't contain common resume section headers
  const lines = text.split('\n');
  const commonHeaders = ['experience', 'education', 'skills', 'projects', 'certifications', 'summary', 'objective'];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !commonHeaders.some(header => trimmedLine.toLowerCase().includes(header))) {
      return trimmedLine;
    }
  }
  return '';
}

function extractEmail(text: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
}

function extractPhone(text: string): string {
  const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
}

function extractLinkedIn(text: string): string {
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|company)\/[a-zA-Z0-9-]+/;
  const match = text.match(linkedinRegex);
  return match ? match[0] : '';
}

function extractGithub(text: string): string {
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/;
  const match = text.match(githubRegex);
  return match ? match[0] : '';
}

function extractPortfolio(text: string): string {
  // Look for common portfolio URL patterns
  const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|io|dev|me|net|org)(?:\/[^\s]*)?/;
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    // Skip if it's a LinkedIn or GitHub URL
    if (trimmedLine.includes('linkedin') || trimmedLine.includes('github')) {
      continue;
    }
    const match = line.match(portfolioRegex);
    if (match) {
      return match[0];
    }
  }
  return '';
}

function extractEducation(text: string): any[] {
  const education: any[] = [];
  const lines = text.split('\n');
  let currentEducation: any = {};
  let inEducationSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.toLowerCase().includes('education')) {
      inEducationSection = true;
      continue;
    }

    if (inEducationSection && line) {
      // Look for degree pattern
      if (line.match(/bachelor|master|phd|doctorate|degree/i)) {
        if (Object.keys(currentEducation).length > 0) {
          education.push(currentEducation);
          currentEducation = {};
        }
        currentEducation.degree = line;
      }
      // Look for institution
      else if (line.match(/university|college|institute|school/i)) {
        currentEducation.institution = line;
      }
      // Look for dates
      else if (line.match(/\d{4}/)) {
        const dates = line.match(/\d{4}/g);
        if (dates) {
          currentEducation.startDate = `${dates[0]}-01-01`;
          if (dates[1]) {
            currentEducation.endDate = `${dates[1]}-12-31`;
            currentEducation.current = false;
          } else {
            currentEducation.current = true;
          }
        }
      }
    }
  }

  if (Object.keys(currentEducation).length > 0) {
    education.push(currentEducation);
  }

  return education;
}

function extractExperience(text: string): any[] {
  const experiences: any[] = [];
  const lines = text.split('\n');
  let currentExperience: any = {};
  let inExperienceSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.toLowerCase().includes('experience') || line.toLowerCase().includes('work')) {
      inExperienceSection = true;
      continue;
    }

    if (inExperienceSection && line) {
      // Look for job title pattern
      if (line.match(/developer|engineer|manager|director|analyst|designer/i)) {
        if (Object.keys(currentExperience).length > 0) {
          experiences.push(currentExperience);
          currentExperience = {};
        }
        currentExperience.title = line;
      }
      // Look for company
      else if (line.match(/inc\.|llc|corp|company|limited/i)) {
        currentExperience.company = line;
      }
      // Look for dates
      else if (line.match(/\d{4}/)) {
        const dates = line.match(/\d{4}/g);
        if (dates) {
          currentExperience.startDate = `${dates[0]}-01-01`;
          if (dates[1]) {
            currentExperience.endDate = `${dates[1]}-12-31`;
            currentExperience.current = false;
          } else {
            currentExperience.current = true;
          }
        }
      }
      // Look for location
      else if (line.match(/, [A-Z]{2}/)) {
        currentExperience.location = line;
      }
      // Description
      else if (line.length > 20) {
        currentExperience.description = line;
      }
    }
  }

  if (Object.keys(currentExperience).length > 0) {
    experiences.push(currentExperience);
  }

  return experiences;
}

function extractSkills(text: string): any[] {
  const skills: any[] = [];
  const lines = text.split('\n');
  let inSkillsSection = false;

  for (const line of lines) {
    if (line.toLowerCase().includes('skills')) {
      inSkillsSection = true;
      continue;
    }

    if (inSkillsSection && line) {
      const skillItems = line.split(/[,;]/).map(item => item.trim());
      for (const item of skillItems) {
        if (item) {
          skills.push({
            name: item,
            category: 'Technical',
            level: 'Intermediate',
            yearsOfExperience: 2
          });
        }
      }
    }
  }

  return skills;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = '';

    if (file.name.endsWith('.pdf')) {
      text = await parsePDF(buffer);
    } else if (file.name.endsWith('.docx')) {
      text = await parseDOCX(buffer);
    } else {
      return NextResponse.json({ error: "Unsupported file format" }, { status: 400 });
    }

    const extractedData = {
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      linkedin: extractLinkedIn(text),
      github: extractGithub(text),
      portfolio: extractPortfolio(text),
      education: extractEducation(text),
      experience: extractExperience(text),
      skills: extractSkills(text)
    };

    // Call the add-all endpoint with the extracted data
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/add-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(extractedData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user data');
    }

    return NextResponse.json({ 
      message: "Resume processed successfully",
      data: extractedData 
    });
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
} 