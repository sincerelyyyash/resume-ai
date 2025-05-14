"use server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain, SequentialChain } from "langchain/chains";


const apiKey = process.env.GOOGLE_API_KEY;

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
  apiKey: apiKey,
});

const jdParserPrompt = new PromptTemplate({
  template: `You're an expert job description analyst. Extract the following from the job description:
- Job Title
- Required Skills
- Preferred Skills
- Tools/Technologies
- Responsibilities
- Keywords for ATS matching
- Industry-specific terminology
- Required qualifications
- Company culture indicators

Job Description: {job_description}`,
  inputVariables: ["job_description"],
});

const jdParsingChain = new LLMChain({
  llm,
  prompt: jdParserPrompt,
  outputKey: "parsed_jd",
});

const atsPrompt = new PromptTemplate({
  template: `You're an expert ATS optimization specialist. Analyze this user's resume data: {user_data}

Against this job description analysis: {parsed_jd}

Perform the following analysis:
1. ATS Score Calculation (0-100):
   - Keyword match percentage
   - Format compliance
   - Content relevance
   - Industry alignment

2. Keyword Analysis:
   - Matched keywords (with context)
   - Missing critical keywords
   - Alternative keyword suggestions

3. Content Optimization:
   - Experience alignment
   - Skills prioritization
   - Project relevance

4. Action Items:
   - Specific improvements needed
   - Format adjustments
   - Content restructuring suggestions

Return JSON: {{
  "ats_score": number,
  "matched_keywords": string[],
  "missing_keywords": string[],
  "recommendations": string[],
  "content_analysis": {{
    "experience_alignment": number,
    "skills_alignment": number,
    "project_relevance": number
  }}
}}`,
  inputVariables: ["user_data", "parsed_jd"],
});

const atsChain = new LLMChain({
  llm,
  prompt: atsPrompt,
  outputKey: "analysis",
});

const rewritePrompt = new PromptTemplate({
  template: `You're a professional resume optimization expert. Create an ATS-optimized resume following these strict guidelines:

1. Data Usage:
   - ONLY use information from the user's data
   - DO NOT fabricate or assume any information
   - Select only the most relevant experiences and projects

2. Format Requirements:
   - Use Jake's Resume template structure
   - Maintain consistent formatting
   - Use bullet points for achievements
   - Keep sections clearly separated

3. Content Optimization:
   - Use XYZ formula for experience descriptions: "Accomplished X by implementing Y, which led to Z"
   - Include specific metrics and numbers
   - Use industry-standard action verbs
   - Prioritize relevant keywords naturally

4. ATS Optimization:
   - Include all critical keywords from job description
   - Use standard section headers
   - Maintain clear hierarchy
   - Avoid tables and complex formatting

User's Resume Data: {user_data}

Job Description Analysis: {parsed_jd}

Return optimized resume in JSON format: {{
  "summary": string,
  "experience": [
    {{
      "title": string,
      "company": string,
      "duration": string,
      "achievements": string[]
    }}
  ],
  "projects": [
    {{
      "name": string,
      "description": string,
      "technologies": string[],
      "achievements": string[]
    }}
  ],
  "skills": string[]
}}`,
  inputVariables: ["user_data", "parsed_jd"],
});

const rewriteChain = new LLMChain({
  llm,
  prompt: rewritePrompt,
  outputKey: "optimized_resume_sections",
});

const resumeOptimizerChain = new SequentialChain({
  chains: [jdParsingChain, atsChain, rewriteChain],
  inputVariables: ["job_description", "user_data"],
  outputVariables: [
    "parsed_jd",
    "analysis",
    "optimized_resume_sections",
  ],
});

interface Analysis {
  ats_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  recommendations: string[];
  content_analysis: {
    experience_alignment: number;
    skills_alignment: number;
    project_relevance: number;
  };
}

interface OptimizedResume {
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    achievements: string[];
  }>;
  skills: string[];
}

function parseLLMResponse(response: string): any {
  try {
    // Remove markdown code block syntax if present
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanedResponse);
  } catch (e) {
    console.error('Error parsing LLM response:', e);
    return {};
  }
}

export async function optimizeResume(jobDescription: string, userData: string) {
  try {
    const result = await resumeOptimizerChain.call({
      job_description: jobDescription,
      user_data: userData
    });

    // Parse the analysis JSON string if it exists
    let analysis: Partial<Analysis> = {};
    try {
      if (typeof result.analysis === 'string') {
        analysis = parseLLMResponse(result.analysis);
      } else {
        analysis = result.analysis;
      }
    } catch (e) {
      console.error('Error parsing analysis:', e);
    }

    // Parse the optimized resume sections JSON string if it exists
    let optimizedResume: Partial<OptimizedResume> = {};
    try {
      if (typeof result.optimized_resume_sections === 'string') {
        optimizedResume = parseLLMResponse(result.optimized_resume_sections);
      } else {
        optimizedResume = result.optimized_resume_sections;
      }
    } catch (e) {
      console.error('Error parsing optimized resume:', e);
    }

    // Parse user data to get contact information
    const userInfo = JSON.parse(userData);

    // Categorize skills
    const categorizedSkills = {
      languages: [] as string[],
      frameworks: [] as string[],
      tools: [] as string[],
      libraries: [] as string[]
    };

    // Helper function to categorize a skill
    const categorizeSkill = (skill: string) => {
      const lowerSkill = skill.toLowerCase();
      if (lowerSkill.match(/^(java|python|c\+\+|c#|javascript|typescript|ruby|php|swift|kotlin|go|rust|scala|r|sql|html|css)$/)) {
        categorizedSkills.languages.push(skill);
      } else if (lowerSkill.match(/^(react|angular|vue|node|express|django|flask|spring|laravel|rails|asp\.net|fastapi|next\.js|nuxt\.js)$/)) {
        categorizedSkills.frameworks.push(skill);
      } else if (lowerSkill.match(/^(git|docker|kubernetes|aws|azure|gcp|jenkins|travis|github|gitlab|jira|confluence|vscode|intellij|eclipse|postman)$/)) {
        categorizedSkills.tools.push(skill);
      } else {
        categorizedSkills.libraries.push(skill);
      }
    };

    // Categorize all skills
    (optimizedResume.skills || []).forEach(categorizeSkill);

    // Return a plain object with all necessary data
    return {
      parsed_jd: result.parsed_jd,
      analysis: {
        ats_score: analysis.ats_score || 0,
        matched_keywords: analysis.matched_keywords || [],
        missing_keywords: analysis.missing_keywords || [],
        recommendations: analysis.recommendations || [],
        content_analysis: analysis.content_analysis || {
          experience_alignment: 0,
          skills_alignment: 0,
          project_relevance: 0
        }
      },
      optimized_resume: {
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        linkedin: userInfo.linkedin || '',
        github: userInfo.github || '',
        education: userInfo.education || [],
        experience: optimizedResume.experience || [],
        projects: optimizedResume.projects || [],
        skills: categorizedSkills
      }
    };
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw new Error('Failed to optimize resume. Please try again.');
  }
}