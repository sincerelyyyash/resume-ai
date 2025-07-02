'use server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';

// Initialize Google Gemini
const apiKey = process.env.GOOGLE_API_KEY;

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
  apiKey: apiKey,
});

// Define types for the response
interface OptimizedResume {
  optimized_resume: {
    full_name: string;
    phone_number: string;
    email: string;
    linkedin_url: string;
    github_url: string;
    website_url?: string;
    education_entries: Array<{
      institution: string;
      location: string;
      degree: string;
      date_range: string;
    }>;
    experience_entries: Array<{
      title: string;
      dates: string;
      organization: string;
      location: string;
      responsibilities: string[];
    }>;
    project_entries: Array<{
      name: string;
      technologies: string;
      date_range: string;
      details: string[];
    }>;
    skill_categories: Array<{
      category_name: string;
      skills: string[];
    }>;
    output_filename: string;
  };
  analysis: {
    ats_score: number;
    matched_keywords: Array<{ keyword: string; count: number }>;
    missing_keywords: Array<{ keyword: string; importance: string }>;
    recommendations: {
      experience: string[];
      skills: string[];
      education: string[];
      summary: string;
      format: string[];
    };
    content_analysis: {
      experience_alignment: number;
      skills_alignment: number;
      project_relevance: number;
      education_relevance: number;
    };
  };
}

const RESUME_OPTIMIZATION_PROMPT = `You are Resume-AI, an expert resume writer and ATS optimization specialist. Your task is to optimize the provided resume data to match the job description while maintaining truthfulness and accuracy.

Job Description:
{jobDescription}

User Data:
{userData}

Please analyze and optimize the resume data following these guidelines:
1. Rephrase experience and project descriptions to align with job requirements
2. Maintain factual accuracy — do not invent or alter any information.
3. Highlight relevant skills and achievements
4. Calculate ATS score and provide analysis
5. Identify matched and missing keywords
6. Provide specific recommendations for improvement
7. Do not include https:// in urls for linkedin, github and website/portfolio
8. Do not include any other text or comments in the response
9. Avoid line breaks or extra spacing between bullet points.
10. Make sure the content alignment percentages are out of 100% in the analysis section
11. Do not ask to add GPA in the education section
12. Make sure the project and experience entries are concise and to the point
13. Each experience and project entry should have exactly 3 bullet points, focusing on quantifiable achievements, technical impact, and business outcomes
14. In Output arrange the experience and project entries in reverse chronological order(most recent first)
15. Entry Management Rules:
    - If the total number of experience and project entries is 5 or less, keep ALL entries
    - If the total is more than 5, prioritize keeping all experience entries and only remove project entries if necessary
    - When removing entries, prioritize keeping the most recent and relevant ones
    - Never remove entries if the total is 5 or less
16. For skills section, create up to 4 relevant categories based on the skills provided and job requirements. Group similar skills together under meaningful category names.
17. If no skills are provided in the user data, analyze the job description and create appropriate skill categories with relevant skills.
18. Format all dates consistently as "Month, Year" (e.g., "January, 2024") throughout the resume, including experience, projects, and education sections.

CRITICAL INSTRUCTION: You must return ONLY a raw JSON object. Do not include any markdown formatting, code blocks, or additional text. The response must be a single JSON object that can be parsed directly.

The response must follow this exact structure:
{{
  "optimized_resume": {{
    "full_name": "string",
    "phone_number": "string",
    "email": "string",
    "linkedin_url": "string",
    "github_url": "string",
    "website_url": "string",
    "education_entries": [
      {{
        "institution": "string",
        "location": "string",
        "degree": "string",
        "date_range": "string"
      }}
    ],
    "experience_entries": [
      {{
        "title": "string",
        "dates": "string",
        "organization": "string",
        "location": "string",
        "responsibilities": ["string"]
      }}
    ],
    "project_entries": [
      {{
        "name": "string",
        "technologies": "string",
        "date_range": "string",
        "details": ["string"]
      }}
    ],
    "skill_categories": [
      {{
        "category_name": "string",
        "skills": ["string"]
      }}
    ],
    "output_filename": "string"
  }},
  "analysis": {{
    "ats_score": number,
    "matched_keywords": [{{ "keyword": "string", "count": number }}],
    "missing_keywords": [{{ "keyword": "string", "importance": "string" }}],
    "recommendations": {{
      "experience": ["string"],
      "skills": ["string"],
      "education": ["string"],
      "summary": "string",
      "format": ["string"]
    }},
    "content_analysis": {{
      "experience_alignment": number,
      "skills_alignment": number,
      "project_relevance": number,
      "education_relevance": number
    }}
  }}
}}`;

export const optimizeResume = async (jobDescription: string, userData: string): Promise<OptimizedResume> => {
  try {
    // Create prompt template
    const prompt = new PromptTemplate({
      template: RESUME_OPTIMIZATION_PROMPT,
      inputVariables: ['jobDescription', 'userData'],
    });

    // Create chain
    const chain = new LLMChain({
      llm,
      prompt,
    });

    // Generate response
    const response = await chain.call({
      jobDescription,
      userData,
    });

    // Clean the response text to ensure it's valid JSON
    const cleanedResponse = response.text
      .replace(/```json\n?/g, '') // Remove JSON code block markers
      .replace(/```\n?/g, '')     // Remove any remaining code block markers
      .replace(/^[^{]*/, '')      // Remove any text before the first {
      .replace(/[^}]*$/, '')      // Remove any text after the last }
      .trim();                    // Remove any extra whitespace

    // Parse the response
    const optimizedResume: OptimizedResume = JSON.parse(cleanedResponse);

    // Ensure skill_categories is always an array
    if (!optimizedResume.optimized_resume.skill_categories) {
      optimizedResume.optimized_resume.skill_categories = [];
    }

    return optimizedResume;
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw new Error('Failed to optimize resume');
  }
}; 