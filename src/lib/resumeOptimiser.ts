import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain, SequentialChain } from "langchain/chains";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});

const jdParserPrompt = new PromptTemplate({
  template: `You're an expert job description analyst. Extract:
- Job Title
- Required Skills
- Preferred Skills
- Tools/Technologies
- Responsibilities
- Keywords for ATS matching

From the following JD:
{job_description}`,
  inputVariables: ["job_description"],
});
const jdParsingChain = new LLMChain({
  llm,
  prompt: jdParserPrompt,
  outputKey: "parsed_jd",
});

const normalizePrompt = new PromptTemplate({
  template: `You're a resume parser. Normalize this user data:
{user_data}

Convert into structured JSON:
{
  summary: string,
  skills: [...],
  experience: [
    {
      jobTitle: string,
      company: string,
      startDate: string,
      endDate: string,
      description: string
    }
  ],
  education: [...],
  certifications: [...]
}`,
  inputVariables: ["user_data"],
});
const normalizeChain = new LLMChain({
  llm,
  prompt: normalizePrompt,
  outputKey: "structured_resume",
});

const atsPrompt = new PromptTemplate({
  template: `You're a career coach. Compare this user's resume:
{structured_resume}

With this job description insight:
{parsed_jd}

- Identify strong matches
- Identify skill/experience gaps
- Rate ATS keyword presence (0Ð100%)
- Suggest improvements

Output in JSON:
{
  ats_score: 0-100,
  matched_keywords: [...],
  missing_keywords: [...],
  recommendations: [...]
}`,
  inputVariables: ["structured_resume", "parsed_jd"],
});
const atsChain = new LLMChain({
  llm,
  prompt: atsPrompt,
  outputKey: "analysis",
});

const rewritePrompt = new PromptTemplate({
  template: `You're a resume writing assistant optimizing resumes for ATS.

Rewrite the user's experience and skills to:
- Highlight matching JD terms
- Use action-result style
- Include relevant keywords naturally
- Keep content professional and authentic

Original Experience:
{structured_resume}

JD Context:
{parsed_jd}

Return optimized experience, skills, and summary in JSON.`,
  inputVariables: ["structured_resume", "parsed_jd"],
});
const rewriteChain = new LLMChain({
  llm,
  prompt: rewritePrompt,
  outputKey: "optimized_resume_sections",
});

export const resumeOptimizerChain = new SequentialChain({
  chains: [jdParsingChain, normalizeChain, atsChain, rewriteChain],
  inputVariables: ["job_description", "user_data"],
  outputVariables: [
    "parsed_jd",
    "structured_resume",
    "analysis",
    "optimized_resume_sections",
  ],
});

