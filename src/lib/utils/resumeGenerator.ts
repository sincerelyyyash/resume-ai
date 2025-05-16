import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import PDFDocument from 'pdfkit';

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  duration: string;
  gpa?: string;
  highlights?: string[];
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  duration: string;
  achievements: string[];
}

export interface Project {
  name: string;
  description?: string;
  technologies: string[];
  duration?: string;
  achievements: string[];
}

export interface Skills {
  technical: string[];
  soft?: string[];
  tools: string[];
  certifications?: string[];
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  website?: string;
  summary?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skills;
}

function generateMarkdownContent(data: ResumeData): string {
  // Format header with user's personal info
  const header = `# ${data.name}

${data.phone} | [${data.email}](mailto:${data.email}) | [LinkedIn](https://linkedin.com/in/${data.linkedin}) | [GitHub](https://github.com/${data.github})

`;

  // Format education section
  const educationContent = data.education.map(edu => 
    `**${edu.institution}** | ${edu.location}  
*${edu.degree}* | *${edu.duration}*`
  ).join('\n\n');

  // Format experience section
  const experienceContent = data.experience.map(exp => {
    const achievements = exp.achievements.map(achievement => 
      `• ${achievement}`
    ).join('\n');
    
    return `**${exp.title}** | ${exp.duration}  
*${exp.company}* | *${exp.location}*  
${achievements}`;
  }).join('\n\n');

  // Format projects section
  const projectsContent = data.projects.map(project => {
    const achievements = project.achievements.map(achievement => 
      `• ${achievement}`
    ).join('\n');
    
    const technologies = `*${project.technologies.join(', ')}*`;
    
    return `**${project.name}** | ${technologies} | ${project.duration}  
${achievements}`;
  }).join('\n\n');

  // Format skills section with proper grouping
  const skillsContent = [
    `**Technical Skills**: ${data.skills.technical.join(', ')}`,
    `**Soft Skills**: ${data.skills.soft ? data.skills.soft.join(', ') : 'None'}`,
    `**Tools**: ${data.skills.tools.join(', ')}`,
    `**Certifications**: ${data.skills.certifications ? data.skills.certifications.join(', ') : 'None'}`
  ].join('  \n');

  // Combine all sections
  return `${header}## Education
${educationContent}

## Experience
${experienceContent}

## Projects
${projectsContent}

## Skills
${skillsContent}`;
}

function generateHTMLContent(data: ResumeData): string {
  // Generate header with contact information
  const contactSection = `
    <div class="header-container">
      <div class="name-container">
        <h1>${data.name}</h1>
      </div>
      <div class="contact-container">
        <span class="contact-item"><i class="fas fa-envelope"></i> <a href="mailto:${data.email}">${data.email}</a></span>
        <span class="contact-separator">|</span>
        <span class="contact-item"><i class="fas fa-phone"></i> ${data.phone}</span>
        <span class="contact-separator">|</span>
        <span class="contact-item"><i class="fab fa-linkedin"></i> <a href="https://linkedin.com/in/${data.linkedin}">linkedin.com/in/${data.linkedin}</a></span>
        <span class="contact-separator">|</span>
        <span class="contact-item"><i class="fab fa-github"></i> <a href="https://github.com/${data.github}">github.com/${data.github}</a></span>
        ${data.website ? `<span class="contact-separator">|</span><span class="contact-item"><i class="fas fa-globe"></i> <a href="${data.website}">${data.website.replace(/^https?:\/\//, '')}</a></span>` : ''}
      </div>
    </div>
  `;

  // Generate summary section if present
  const summarySection = data.summary ? `
    <div class="section">
      <h2>SUMMARY</h2>
      <div class="summary-content">
        <p>${data.summary}</p>
      </div>
    </div>
  ` : '';

  // Generate education section
  const educationItems = data.education.map(edu => `
    <div class="section-item">
      <div class="item-header">
        <div class="item-title">
          <strong>${edu.institution}</strong>
          ${edu.location ? `<span class="item-location">${edu.location}</span>` : ''}
        </div>
        <div class="item-date">${edu.duration}</div>
      </div>
      <div class="item-subtitle">
        <em>${edu.degree}</em>
        ${edu.gpa ? `<span class="item-gpa">GPA: ${edu.gpa}</span>` : ''}
      </div>
      ${edu.highlights && edu.highlights.length > 0 ? `
        <ul class="item-bullets">
          ${edu.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');

  const educationSection = `
    <div class="section">
      <h2>EDUCATION</h2>
      ${educationItems}
    </div>
  `;

  // Generate experience section
  const experienceItems = data.experience.map(exp => `
    <div class="section-item">
      <div class="item-header">
        <div class="item-title">
          <strong>${exp.title}</strong>
          ${exp.location ? `<span class="item-location">${exp.location}</span>` : ''}
        </div>
        <div class="item-date">${exp.duration}</div>
      </div>
      <div class="item-subtitle">
        <em>${exp.company}</em>
      </div>
      <ul class="item-bullets">
        ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const experienceSection = `
    <div class="section">
      <h2>EXPERIENCE</h2>
      ${experienceItems}
    </div>
  `;

  // Generate projects section
  const projectItems = data.projects.map(project => `
    <div class="section-item">
      <div class="item-header">
        <div class="item-title">
          <strong>${project.name}</strong>
          <span class="item-tech">${project.technologies.join(', ')}</span>
        </div>
        ${project.duration ? `<div class="item-date">${project.duration}</div>` : ''}
      </div>
      ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
      <ul class="item-bullets">
        ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const projectsSection = `
    <div class="section">
      <h2>PROJECTS</h2>
      ${projectItems}
    </div>
  `;

  // Generate skills section
  const technicalSkills = data.skills.technical.length > 0 ? 
    `<div class="skills-group"><strong>Technical:</strong> ${data.skills.technical.join(', ')}</div>` : '';
  
  const softSkills = data.skills.soft && data.skills.soft.length > 0 ? 
    `<div class="skills-group"><strong>Soft Skills:</strong> ${data.skills.soft.join(', ')}</div>` : '';
  
  const toolsSkills = data.skills.tools.length > 0 ? 
    `<div class="skills-group"><strong>Tools:</strong> ${data.skills.tools.join(', ')}</div>` : '';
  
  const certificationSkills = data.skills.certifications && data.skills.certifications.length > 0 ? 
    `<div class="skills-group"><strong>Certifications:</strong> ${data.skills.certifications.join(', ')}</div>` : '';

  const skillsSection = `
    <div class="section">
      <h2>SKILLS</h2>
      <div class="skills-content">
        ${technicalSkills}
        ${toolsSkills}
        ${softSkills}
        ${certificationSkills}
      </div>
    </div>
  `;

  // Combine all sections
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${data.name} - Resume</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
        <style>
          @page {
            size: letter;
            margin: 0.5in;
          }
          body {
            font-family: 'Calibri', 'Roboto', 'Arial', sans-serif;
            line-height: 1.2;
            margin: 0;
            padding: 0;
            color: #333;
            font-size: 11pt;
          }
          .container {
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0;
          }
          h1 {
            font-size: 24pt;
            margin: 0;
            color: #2b5797;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: center;
          }
          h2 {
            font-size: 12pt;
            color: #2b5797;
            border-bottom: 1px solid #2b5797;
            margin: 16px 0 8px 0;
            padding-bottom: 2px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          a {
            color: #2b5797;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          ul {
            margin: 5px 0;
            padding-left: 18px;
          }
          li {
            margin-bottom: 3px;
            line-height: 1.3;
          }
          .header-container {
            margin-bottom: 15px;
            text-align: center;
          }
          .contact-container {
            margin-top: 8px;
            font-size: 10pt;
          }
          .contact-item {
            margin: 0 3px;
          }
          .contact-separator {
            margin: 0 3px;
          }
          .section {
            margin-bottom: 12px;
          }
          .section-item {
            margin-bottom: 10px;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
          }
          .item-title {
            font-weight: normal;
          }
          .item-location {
            margin-left: 10px;
            font-weight: normal;
            font-style: italic;
          }
          .item-date {
            font-weight: normal;
          }
          .item-subtitle {
            margin-bottom: 3px;
            font-size: 10pt;
          }
          .item-gpa {
            margin-left: 15px;
          }
          .item-tech {
            margin-left: 10px;
            font-style: italic;
            font-weight: normal;
            font-size: 10pt;
          }
          .item-description {
            margin-bottom: 3px;
            font-size: 10pt;
          }
          .item-bullets {
            margin-top: 4px;
          }
          .skills-content {
            display: flex;
            flex-direction: column;
          }
          .skills-group {
            margin-bottom: 4px;
          }
          .summary-content {
            text-align: justify;
            line-height: 1.4;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            a {
              color: #2b5797;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${contactSection}
          ${summarySection}
          ${educationSection}
          ${experienceSection}
          ${projectsSection}
          ${skillsSection}
        </div>
      </body>
    </html>
  `;
}

// Register fonts with absolute paths
const fonts = {
  regular: path.join(process.cwd(), 'src', 'lib', 'fonts', 'Roboto-Regular.ttf'),
  bold: path.join(process.cwd(), 'src', 'lib', 'fonts', 'Roboto-Bold.ttf'),
  italic: path.join(process.cwd(), 'src', 'lib', 'fonts', 'Roboto-Italic.ttf')
};

// Verify font files exist
Object.entries(fonts).forEach(([name, fontPath]) => {
  if (!fs.existsSync(fontPath)) {
    throw new Error(`Font file not found: ${fontPath}`);
  }
});

export async function generateResumePDF(data: ResumeData): Promise<{ buffer: Buffer; filename: string }> {
  return new Promise((resolve, reject) => {
    try {
      // Create a unique filename using timestamp and sanitized name
      const timestamp = new Date().getTime();
      const sanitizedName = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `${sanitizedName}-${timestamp}.pdf`;
      const filepath = path.join(process.cwd(), 'public', 'pdfs', filename);

      // Ensure the pdfs directory exists
      const pdfsDir = path.join(process.cwd(), 'public', 'pdfs');
      if (!fs.existsSync(pdfsDir)) {
        fs.mkdirSync(pdfsDir, { recursive: true });
      }

      // Create PDF document
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        info: {
          Title: `${data.name}'s Resume`,
          Author: data.name,
          Subject: 'Professional Resume',
          Keywords: 'resume, professional, career',
          CreationDate: new Date()
        }
      });

      // Register fonts with error handling
      try {
        // Register fonts with their full paths
        doc.registerFont('Roboto', fonts.regular);
        doc.registerFont('Roboto-Bold', fonts.bold);
        doc.registerFont('Roboto-Italic', fonts.italic);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`Failed to register fonts: ${errorMessage}`);
      }

      // Set default font after registration
      doc.font('Roboto');

      const chunks: Buffer[] = [];

      // Create write stream
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Collect PDF chunks
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({ buffer, filename });
      });
      doc.on('error', reject);

      // Header
      doc.font('Roboto-Bold').fontSize(24).text(data.name, { align: 'center' });
      doc.moveDown(0.5);

      // Contact Information
      const contactInfo = [
        data.email,
        data.phone,
        data.linkedin,
        data.github
      ].filter(Boolean).join(' • ');
      
      doc.font('Roboto').fontSize(10).text(contactInfo, { align: 'center' });
      doc.moveDown(1);

      // Summary
      if (data.summary) {
        doc.font('Roboto-Bold').fontSize(14).text('Professional Summary', { underline: true });
        doc.font('Roboto').fontSize(10).text(data.summary);
        doc.moveDown(1);
      }

      // Experience
      if (data.experience?.length) {
        doc.font('Roboto-Bold').fontSize(14).text('Professional Experience', { underline: true });
        doc.moveDown(0.5);

        data.experience.forEach((exp: Experience) => {
          doc.font('Roboto-Bold').fontSize(12).text(`${exp.title} at ${exp.company}`);
          doc.font('Roboto').fontSize(10).text(exp.duration);
          doc.moveDown(0.5);

          exp.achievements.forEach((achievement: string) => {
            doc.font('Roboto').fontSize(10).text(`• ${achievement}`, { indent: 20 });
          });
          doc.moveDown(1);
        });
      }

      // Education
      if (data.education?.length) {
        doc.font('Roboto-Bold').fontSize(14).text('Education', { underline: true });
        doc.moveDown(0.5);

        data.education.forEach((edu: Education) => {
          doc.font('Roboto-Bold').fontSize(12).text(`${edu.degree} - ${edu.institution}`);
          doc.font('Roboto').fontSize(10).text(edu.duration);
          if (edu.gpa) {
            doc.font('Roboto').fontSize(10).text(`GPA: ${edu.gpa}`);
          }
          if (edu.highlights?.length) {
            edu.highlights.forEach((highlight: string) => {
              doc.font('Roboto').fontSize(10).text(`• ${highlight}`, { indent: 20 });
            });
          }
          doc.moveDown(1);
        });
      }

      // Projects
      if (data.projects?.length) {
        doc.font('Roboto-Bold').fontSize(14).text('Projects', { underline: true });
        doc.moveDown(0.5);

        data.projects.forEach((project: Project) => {
          doc.font('Roboto-Bold').fontSize(12).text(project.name);
          if (project.description) {
            doc.font('Roboto').fontSize(10).text(project.description);
          }
          if (project.technologies?.length) {
            doc.font('Roboto').fontSize(10).text(`Technologies: ${project.technologies.join(', ')}`);
          }
          if (project.achievements?.length) {
            project.achievements.forEach((achievement: string) => {
              doc.font('Roboto').fontSize(10).text(`• ${achievement}`, { indent: 20 });
            });
          }
          doc.moveDown(1);
        });
      }

      // Skills
      if (data.skills) {
        doc.font('Roboto-Bold').fontSize(14).text('Skills', { underline: true });
        doc.moveDown(0.5);

        if (data.skills.technical?.length) {
          doc.font('Roboto-Bold').fontSize(12).text('Technical Skills');
          doc.font('Roboto').fontSize(10).text(data.skills.technical.join(', '));
          doc.moveDown(0.5);
        }

        if (data.skills.soft?.length) {
          doc.font('Roboto-Bold').fontSize(12).text('Soft Skills');
          doc.font('Roboto').fontSize(10).text(data.skills.soft.join(', '));
          doc.moveDown(0.5);
        }

        if (data.skills.tools?.length) {
          doc.font('Roboto-Bold').fontSize(12).text('Tools & Technologies');
          doc.font('Roboto').fontSize(10).text(data.skills.tools.join(', '));
          doc.moveDown(0.5);
        }

        if (data.skills.certifications?.length) {
          doc.font('Roboto-Bold').fontSize(12).text('Certifications');
          doc.font('Roboto').fontSize(10).text(data.skills.certifications.join(', '));
        }
      }

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function optimizeAndGenerateResume(
  optimizedData: {
    summary?: string;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skills: Skills;
  },
  userData: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website?: string;
  }
): Promise<{ buffer: Buffer; filename: string }> {
  // Combine the optimized content with personal data that wasn't sent to the LLM
  const completeResumeData: ResumeData = {
    ...userData,
    summary: optimizedData.summary,
    education: optimizedData.education,
    experience: optimizedData.experience,
    projects: optimizedData.projects,
    skills: optimizedData.skills
  };

  // Generate the PDF with the complete data
  return generateResumePDF(completeResumeData);
}

// Template for the resume.md file
export const resumeTemplateMarkdown = `# {{name}}

## Education
{{education}}

## Experience
{{experience}}

## Projects
{{projects}}

## Skills
{{skills}}
`;