import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

interface Education {
  school: string;
  location: string;
  degree: string;
  duration: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  duration: string;
  achievements: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  duration: string;
  achievements: string[];
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    libraries: string[];
  };
}

function generateMarkdownContent(data: ResumeData): string {
  // Format header with user's personal info
  const header = `# ${data.name}

${data.phone} | [${data.email}](mailto:${data.email}) | [LinkedIn](https://linkedin.com/in/${data.linkedin}) | [GitHub](https://github.com/${data.github})

`;

  // Format education section
  const educationContent = data.education.map(edu => 
    `**${edu.school}** | ${edu.location}  
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
    `**Languages**: ${data.skills.languages.join(', ')}`,
    `**Frameworks**: ${data.skills.frameworks.join(', ')}`,
    `**Developer Tools**: ${data.skills.tools.join(', ')}`,
    `**Libraries**: ${data.skills.libraries.join(', ')}`
  ].join('  \n');

  // Combine all sections
  return `${header}## Education
${educationContent}

## Experience
${experienceContent}

## Projects
${projectsContent}

## Technical Skills
${skillsContent}`;
}

function generateHTMLContent(data: ResumeData): string {
  const markdownContent = generateMarkdownContent(data);
  const htmlContent = marked(markdownContent);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page {
            size: letter;
            margin: 0.5in;
          }
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.2;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0;
            color: #000;
            font-size: 11pt;
          }
          h1 {
            text-align: center;
            margin: 0 0 5px 0;
            font-size: 24pt;
            font-weight: bold;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          h2 {
            color: #000;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            margin: 16px 0 8px 0;
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          a {
            color: #000;
            text-decoration: underline;
          }
          ul {
            padding-left: 20px;
            margin: 4px 0;
          }
          li {
            margin-bottom: 3px;
            font-size: 10.5pt;
          }
          p {
            margin: 4px 0;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
          }
          .contact-info {
            text-align: center;
            font-size: 10pt;
            margin-bottom: 15px;
          }
          .resume-section {
            margin-bottom: 10px;
          }
          .resume-item {
            margin-bottom: 10px;
          }
          .resume-item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
          }
          .resume-item-left {
            font-weight: bold;
          }
          .resume-item-right {
            text-align: right;
          }
          .resume-item-subheader {
            display: flex;
            justify-content: space-between;
            font-style: italic;
            margin-bottom: 3px;
            font-size: 10pt;
          }
          .skills-section {
            margin-top: 5px;
          }
          .skills-item {
            margin-bottom: 2px;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            a {
              text-decoration: underline;
              color: #000;
            }
          }
        </style>
      </head>
      <body>
        <div class="resume-content">
          ${htmlContent}
        </div>
      </body>
    </html>
  `;
}

export async function generateResumePDF(data: ResumeData): Promise<Buffer> {
  try {
    // Generate HTML content
    const htmlContent = generateHTMLContent(data);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content and wait for network idle
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    // Close browser
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF resume');
  }
}

// Template for the resume.md file
export const resumeTemplateMarkdown = `# {{name}}

## Education
{{education}}

## Experience
{{experience}}

## Projects
{{projects}}

## Technical Skills
{{skills}}
`;