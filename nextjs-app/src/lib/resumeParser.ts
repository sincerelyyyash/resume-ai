'use server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';
import { ResumeData } from '@/types/resume-upload.schema';

// Initialize Google Gemini
const apiKey = process.env.GOOGLE_API_KEY;

// Validate API key on initialization
if (!apiKey) {
  console.warn('GOOGLE_API_KEY environment variable is not set. AI parsing will not work.');
}

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.3,
  maxOutputTokens: 3000,
  apiKey: apiKey,
});

const RESUME_PARSING_PROMPT = `You are Resume-AI, an expert at parsing resume documents and extracting structured data. Analyze the resume text and extract information into the specified JSON format.

Resume Text:
{resumeText}

Please carefully analyze the resume text and extract the following information:

1. Personal Information:
   - Full name
   - Bio/summary (if present)
   - Portfolio website URL
   - LinkedIn profile URL
   - GitHub profile URL

2. Work Experience:
   - Job title
   - Company name
   - Description/responsibilities (keep original text but clean it up)
   - Start date and end date (convert to YYYY-MM-DD format)
   - Whether it's current position
   - Location

3. Education:
   - Institution name
   - Degree
   - Field of study
   - Start date and end date (convert to YYYY-MM-DD format)
   - Whether currently studying

4. Projects:
   - Project name
   - Description
   - Technologies used (as array)
   - Start date and end date (convert to YYYY-MM-DD format)
   - Project URL (if mentioned)

5. Skills: 
   - Consolidate similar technologies into single entries by category
   - Categories: Determine 4-5 most appropriate categories based on the technologies found in the resume
   - Example: Instead of separate "PostgreSQL", "MongoDB", "Redis" → One entry: "PostgreSQL, MongoDB, Redis" under appropriate category
   - Use highest skill level and max years of experience for consolidated entries

6. Certifications:
   - Certification title
   - Issuing organization
   - Description (if available)
   - Issue date (convert to YYYY-MM-DD format)
   - Expiry date (if mentioned)
   - Credential URL (if mentioned)

Guidelines:
- Extract only explicitly mentioned information
- Convert dates to YYYY-MM-DD (estimate day/month as 01 if not specified)
- For skills: Group similar technologies under same category, combine into single comma-separated entries
- Return ONLY valid JSON, no markdown or code blocks

JSON Structure:
{{
  "user": {{
    "name": "string",
    "bio": "string", 
    "portfolio": "string",
    "linkedin": "string",
    "github": "string"
  }},
  "experiences": [{{
    "title": "string",
    "company": "string",
    "description": "string",
    "startDate": "YYYY-MM-DD", 
    "endDate": "YYYY-MM-DD",
    "current": boolean,
    "location": "string"
  }}],
  "education": [{{
    "institution": "string",
    "degree": "string",
    "field": "string", 
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "current": boolean
  }}],
  "projects": [{{
    "title": "string",
    "description": "string", 
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "url": "string",
    "technologies": ["array"]
  }}],
  "skills": [{{
    "name": "string (comma-separated if consolidated)",
    "category": "string",
    "level": "Beginner|Intermediate|Expert", 
    "yearsOfExperience": number
  }}],
  "certifications": [{{
    "title": "string",
    "issuer": "string",
    "description": "string",
    "issueDate": "YYYY-MM-DD",
    "expiryDate": "YYYY-MM-DD", 
    "credentialUrl": "string"
  }}]
}}`;

export const parseResumeText = async (resumeText: string): Promise<ResumeData> => {
  try {
    if (!apiKey) {
      throw new Error('Google API key is not configured. Please set GOOGLE_API_KEY environment variable.');
    }

    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('Resume text is empty or invalid.');
    }

    console.log('Initiating AI parsing with resume text length:', resumeText.length);

    // Create prompt template
    const prompt = new PromptTemplate({
      template: RESUME_PARSING_PROMPT,
      inputVariables: ['resumeText'],
    });

    // Create chain
    const chain = new LLMChain({
      llm,
      prompt,
    });

    // Generate response
    console.log('Calling Google Gemini API...');
    const response = await chain.call({
      resumeText,
    });

    console.log('AI response received, processing...');

    // Clean the response text to ensure it's valid JSON
    const cleanedResponse = response.text
      .replace(/```json\n?/g, '') // Remove JSON code block markers
      .replace(/```\n?/g, '')     // Remove any remaining code block markers
      .replace(/^[^{]*/, '')      // Remove any text before the first {
      .replace(/[^}]*$/, '')      // Remove any text after the last }
      .trim();                    // Remove any extra whitespace

    console.log('Cleaned AI Response:', cleanedResponse.substring(0, 200) + '...');

    if (!cleanedResponse || !cleanedResponse.startsWith('{')) {
      throw new Error('Invalid response format from AI service. Expected JSON object.');
    }

    // Parse the response
    let parsedData: ResumeData;
    try {
      parsedData = JSON.parse(cleanedResponse);
    } catch (jsonError) {
      console.error('JSON parsing failed:', jsonError);
      console.error('Raw response:', cleanedResponse);
      throw new Error('Failed to parse AI response as JSON. The AI service may have returned invalid data.');
    }

    // Ensure all arrays exist even if empty
    if (!parsedData.user) parsedData.user = {};
    if (!parsedData.projects) parsedData.projects = [];
    if (!parsedData.experiences) parsedData.experiences = [];
    if (!parsedData.education) parsedData.education = [];
    if (!parsedData.skills) parsedData.skills = [];
    if (!parsedData.certifications) parsedData.certifications = [];

    console.log('Successfully parsed resume data:', {
      hasUser: !!parsedData.user,
      projectsCount: parsedData.projects.length,
      experiencesCount: parsedData.experiences.length,
      educationCount: parsedData.education.length,
      skillsCount: parsedData.skills.length,
      certificationsCount: parsedData.certifications.length
    });

    return parsedData;
  } catch (error) {
    console.error('Error parsing resume text:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Google API key configuration error. Please contact support.');
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new Error('AI service rate limit exceeded. Please try again in a few minutes.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error while connecting to AI service. Please check your internet connection.');
      }
      throw error;
    }
    
    throw new Error('An unexpected error occurred while parsing the resume.');
  }
}; 