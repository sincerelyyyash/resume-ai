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

    // Step 1: Clean the response
    const cleanedResponse = response.text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/^[^{]*/, '')
      .replace(/[^}\]]*$/, '') // Remove after last } or ]
      .trim();

    // Step 2: Try to parse as JSON
    try {
      return JSON.parse(cleanedResponse);
    } catch {
      // Step 3: Truncate at last valid closing brace/bracket
      const lastCurly = cleanedResponse.lastIndexOf('}');
      const lastSquare = cleanedResponse.lastIndexOf(']');
      const lastValid = Math.max(lastCurly, lastSquare);
      if (lastValid > 0) {
        let truncated = cleanedResponse.substring(0, lastValid + 1);
        // Step 3b: Try to close open structures
        const openCurly = (truncated.match(/{/g) || []).length;
        let closeCurly = (truncated.match(/}/g) || []).length;
        const openSquare = (truncated.match(/\[/g) || []).length;
        let closeSquare = (truncated.match(/\]/g) || []).length;
        while (openCurly > closeCurly) {
          truncated += '}';
          closeCurly++;
        }
        while (openSquare > closeSquare) {
          truncated += ']';
          closeSquare++;
        }
        try {
          return JSON.parse(truncated);
        } catch {
          // Step 4: Log and show user-friendly error
          console.error('JSON parsing failed after repair. Response length:', cleanedResponse.length);
          console.error('First 500 chars:', cleanedResponse.substring(0, 500));
          console.error('Last 500 chars:', cleanedResponse.substring(Math.max(0, cleanedResponse.length - 500)));
          throw new Error('Resume optimization failed: AI response was incomplete or malformed. Please try again.');
        }
      } else {
        // Step 4: Log and show user-friendly error
        console.error('JSON parsing failed. Response length:', cleanedResponse.length);
        console.error('First 500 chars:', cleanedResponse.substring(0, 500));
        console.error('Last 500 chars:', cleanedResponse.substring(Math.max(0, cleanedResponse.length - 500)));
        throw new Error('Resume optimization failed: AI response was incomplete or malformed. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw new Error('Failed to optimize resume');
  }
}; 