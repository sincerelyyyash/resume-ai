"use server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain, SequentialChain } from "langchain/chains";
import { Education, Experience, Project, Skills } from './utils/resumeGenerator';
import { ChatOpenAI } from '@langchain/openai';

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
- Required Skills (technical and soft skills)
- Preferred Skills (technical and soft skills)
- Tools/Technologies (software, platforms, methodologies)
- Responsibilities (key job functions)
- Keywords for ATS matching (including variations and synonyms)
- Industry-specific terminology and buzzwords
- Required qualifications (degrees, certifications, years of experience)
- Company culture indicators and values
- Team structure and reporting relationships (if mentioned)

Format your response as structured JSON:
{{
  "job_title": "",
  "required_skills": [],
  "preferred_skills": [],
  "tools_technologies": [],
  "responsibilities": [],
  "ats_keywords": [],
  "industry_terminology": [],
  "required_qualifications": [],
  "culture_indicators": [],
  "team_structure": ""
}}

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

Perform the following detailed analysis:
1. ATS Score Calculation (0-100):
   - Keyword match percentage (50% of score)
   - Format compliance (20% of score)
   - Content relevance (20% of score)
   - Industry alignment (10% of score)

2. Keyword Analysis:
   - Matched keywords (with context and frequency)
   - Missing critical keywords (categorized by importance)
   - Alternative keyword suggestions (synonyms and industry variants)
   - Keyword density analysis

3. Content Optimization Opportunities:
   - Experience alignment gaps
   - Skills prioritization recommendations
   - Project relevance to job requirements
   - Education relevance and presentation
   - Achievement metrics and quantification opportunities

4. Detailed Action Items:
   - Experience bullet point reformulations
   - Skills section reorganization
   - Education presentation improvements
   - Summary/profile statement optimization
   - Format and structure recommendations

Return detailed JSON: {{
  "ats_score": number,
  "matched_keywords": [{"keyword": string, "context": string, "frequency": number}],
  "missing_keywords": [{"keyword": string, "importance": "high|medium|low"}],
  "alternative_keywords": [{"missing": string, "alternatives": string[]}],
  "recommendations": {
    "experience": string[],
    "skills": string[],
    "education": string[],
    "summary": string,
    "format": string[]
  },
  "content_analysis": {
    "experience_alignment": number,
    "skills_alignment": number,
    "project_relevance": number,
    "education_relevance": number
  }
}}`,
  inputVariables: ["user_data", "parsed_jd"],
});

const atsChain = new LLMChain({
  llm,
  prompt: atsPrompt,
  outputKey: "analysis",
});

const rewritePrompt = new PromptTemplate({
  template: `You're a professional resume optimization expert. Your task is to completely transform the user's resume to match the job description requirements while maintaining authenticity and truthfulness. Follow these guidelines:

1. Data Usage Policy:
   - ONLY use information provided in the user's data
   - DO NOT fabricate or assume any information
   - Reframe and restructure existing information to highlight job-relevant skills and experiences

2. Resume Optimization Strategy:
   - COMPLETELY REWRITE each experience and education bullet point to:
     * Incorporate key job description terms and phrases
     * Use industry-specific terminology
     * Highlight transferable skills relevant to the position
     * Quantify achievements wherever possible
     * Follow the XYZ formula: "Accomplished X by implementing Y, which led to Z"
   
3. Format Requirements:
   - Use bullet points for achievements (4-6 bullets per role)
   - Begin each bullet with strong action verbs
   - Maintain consistent tense (past tense for previous roles, present for current)
   - Prioritize bullets based on relevance to target job
   - Ensure 60-80 words per job role description
   - Remove personal pronouns

4. ATS Optimization Rules:
   - Incorporate priority keywords from job description naturally
   - Use standard section headers
   - Maintain clear hierarchy
   - Include both spelled-out terms and acronyms for technical skills
   - Use job title variations that match the target position

User's Resume Data: {user_data}

Job Description Analysis: {parsed_jd}

ATS Analysis: {analysis}

Return the optimized resume in this JSON format:
{{
  "summary": string (compelling, job-targeted professional summary),
  "education": [
    {
      "degree": string,
      "institution": string,
      "duration": string,
      "gpa": string (optional),
      "highlights": string[] (optimized bullet points highlighting relevant coursework/achievements)
    }
  ],
  "experience": [
    {
      "title": string,
      "company": string,
      "duration": string,
      "achievements": string[] (completely rewritten, optimized bullet points)
    }
  ],
  "projects": [
    {
      "name": string,
      "description": string (optimized),
      "technologies": string[],
      "achievements": string[] (optimized bullet points)
    }
  ],
  "skills": {
    "technical": string[],
    "soft": string[],
    "tools": string[],
    "certifications": string[]
  }
}}`,
  inputVariables: ["user_data", "parsed_jd", "analysis"],
});

const rewriteChain = new LLMChain({
  llm,
  prompt: rewritePrompt,
  outputKey: "optimized_resume",
});

const resumeOptimizerChain = new SequentialChain({
  chains: [jdParsingChain, atsChain, rewriteChain],
  inputVariables: ["job_description", "user_data"],
  outputVariables: [
    "parsed_jd",
    "analysis",
    "optimized_resume",
  ],
});

interface Analysis {
  ats_score: number;
  matched_keywords: Array<{
    keyword: string;
    context: string;
    frequency: number;
  }>;
  missing_keywords: Array<{
    keyword: string;
    importance: string;
  }>;
  alternative_keywords: Array<{
    missing: string;
    alternatives: string[];
  }>;
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
}

interface OptimizedResume {
  summary?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skills;
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

interface OptimizationAnalysis {
  ats_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  recommendations: string[];
}

interface OptimizationResult {
  optimized_resume: OptimizedResume;
  analysis: OptimizationAnalysis;
}

const RESUME_OPTIMIZATION_PROMPT = `You are an expert resume optimizer. Your task is to optimize the given resume content for the provided job description.

Job Description:
{jobDescription}

Resume Content:
{resumeContent}

Please analyze and optimize the resume content to better match the job requirements. Consider:
1. Highlighting relevant skills and experiences
2. Rewording achievements to match job requirements
3. Adding missing keywords naturally
4. Improving the overall impact of the content

Return the optimized content in the same JSON structure as the input, with any necessary modifications.`;

export async function optimizeResume(jobDescription: string, resumeContent: string): Promise<OptimizationResult> {
  try {
    const llm = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.7,
    });

    const prompt = PromptTemplate.fromTemplate(RESUME_OPTIMIZATION_PROMPT);

    const chain = prompt.pipe(llm);

    const result = await chain.invoke({
      jobDescription,
      resumeContent
    });

    // Parse the LLM response
    const optimizedContent = JSON.parse(result.content.toString());
    
    // Calculate ATS score and analysis
    const analysis = await analyzeResume(jobDescription, optimizedContent);

    return {
      optimized_resume: optimizedContent,
      analysis
    };
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw new Error('Failed to optimize resume content');
  }
}

async function analyzeResume(jobDescription: string, resumeContent: any): Promise<OptimizationAnalysis> {
  try {
    const llm = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0.3,
    });

    const analysisPrompt = PromptTemplate.fromTemplate(`
      Analyze how well the resume matches the job description.
      
      Job Description:
      {jobDescription}
      
      Resume Content:
      {resumeContent}
      
      Provide analysis in the following JSON format:
      {
        "ats_score": number (0-100),
        "matched_keywords": string[],
        "missing_keywords": string[],
        "recommendations": string[]
      }
    `);

    const chain = analysisPrompt.pipe(llm);

    const result = await chain.invoke({
      jobDescription,
      resumeContent: JSON.stringify(resumeContent)
    });

    return JSON.parse(result.content.toString());
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return {
      ats_score: 0,
      matched_keywords: [],
      missing_keywords: [],
      recommendations: ['Failed to analyze resume']
    };
  }
}