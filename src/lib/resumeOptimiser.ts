"use server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain, SequentialChain } from "langchain/chains";
import { Education, Experience, Project, Skills } from './utils/resumeGenerator';


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

Format your response as structured JSON with the following fields:

{{
  "job_title": "string",
  "required_skills": ["string"],
  "preferred_skills": ["string"],
  "tools_technologies": ["string"],
  "responsibilities": ["string"],
  "ats_keywords": ["string"],
  "industry_terminology": ["string"],
  "required_qualifications": ["string"],
  "culture_indicators": ["string"],
  "team_structure": "string"
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

Return detailed JSON with the following structure:

{{
  "ats_score": 0,
  "matched_keywords": [
    {{
      "keyword": "string",
      "context": "string",
      "frequency": 0
    }}
  ],
  "missing_keywords": [
    {{
      "keyword": "string",
      "importance": "high|medium|low"
    }}
  ],
  "alternative_keywords": [
    {{
      "missing": "string",
      "alternatives": ["string"]
    }}
  ],
  "recommendations": {{
    "experience": ["string"],
    "skills": ["string"],
    "education": ["string"],
    "summary": "string",
    "format": ["string"]
  }},
  "content_analysis": {{
    "experience_alignment": 0,
    "skills_alignment": 0,
    "project_relevance": 0,
    "education_relevance": 0
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
  "summary": "string",
  "education": [
    {{
      "degree": "string",
      "institution": "string",
      "duration": "string",
      "gpa": "string",
      "highlights": ["string"]
    }}
  ],
  "experience": [
    {{
      "title": "string",
      "company": "string",
      "duration": "string",
      "achievements": ["string"]
    }}
  ],
  "projects": [
    {{
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "achievements": ["string"]
    }}
  ],
  "skills": {{
    "technical": ["string"],
    "soft": ["string"],
    "tools": ["string"],
    "certifications": ["string"]
  }}
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
  outputVariables: ["parsed_jd", "analysis", "optimized_resume"],
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
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  summary?: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skills;
}

function parseLLMResponse(response: string): any {
  try {
    // Remove markdown code block syntax if present
    let cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    // Find the first occurrence of a valid JSON object
    const jsonStart = cleanedResponse.indexOf('{');
    const jsonEnd = cleanedResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No valid JSON object found in response');
    }
    
    // Extract just the JSON portion
    cleanedResponse = cleanedResponse.slice(jsonStart, jsonEnd);
    
    return JSON.parse(cleanedResponse);
  } catch (e: unknown) {
    console.error('Error parsing LLM response:', e);
    const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
    throw new Error(`Failed to parse LLM response: ${errorMessage}`);
  }
}

export async function optimizeResume(jobDescription: string, userData: string): Promise<{
  parsed_jd: any;
  analysis: Analysis;
  optimized_resume: OptimizedResume;
}> {
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
      if (typeof result.optimized_resume === 'string') {
        optimizedResume = parseLLMResponse(result.optimized_resume);
      } else {
        optimizedResume = result.optimized_resume;
      }
    } catch (e) {
      console.error('Error parsing optimized resume:', e);
    }

    // Parse user data to get contact information
    const userInfo = JSON.parse(userData);

    // Return a plain object with all necessary data
    return {
      parsed_jd: result.parsed_jd,
      analysis: {
        ats_score: analysis.ats_score || 0,
        matched_keywords: analysis.matched_keywords || [],
        missing_keywords: analysis.missing_keywords || [],
        alternative_keywords: analysis.alternative_keywords || [],
        recommendations: analysis.recommendations || {
          experience: [],
          skills: [],
          education: [],
          summary: "",
          format: []
        },
        content_analysis: analysis.content_analysis || {
          experience_alignment: 0,
          skills_alignment: 0,
          project_relevance: 0,
          education_relevance: 0
        }
      },
      optimized_resume: {
        name: userInfo.name || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        linkedin: userInfo.linkedin || '',
        github: userInfo.github || '',
        summary: optimizedResume.summary || '',
        education: optimizedResume.education || [],
        experience: optimizedResume.experience || [],
        projects: optimizedResume.projects || [],
        skills: optimizedResume.skills || {
          technical: [],
          soft: [],
          tools: [],
          certifications: []
        }
      }
    };
  } catch (error) {
    console.error('Error optimizing resume:', error);
    throw new Error('Failed to optimize resume. Please try again.');
  }
}