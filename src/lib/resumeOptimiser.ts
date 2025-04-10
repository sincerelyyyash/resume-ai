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
  template: `You're an expert job description analyst. Extract the following from the job description:
- Job Title
- Required Skills
- Preferred Skills
- Tools/Technologies
- Responsibilities
- Keywords for ATS matching

Job Description:
{job_description}`,
  inputVariables: ["job_description"],
});
const jdParsingChain = new LLMChain({
  llm,
  prompt: jdParserPrompt,
  outputKey: "parsed_jd",
});

const atsPrompt = new PromptTemplate({
  template: `You're a career coach. Compare this user's structured resume:
{user_data}

With this job description insight:
{parsed_jd}

Perform the following:
- Identify strong matches
- Highlight skill/experience gaps
- Estimate ATS keyword presence (0Ð100%)
- Give clear, actionable improvement suggestions

Return JSON:
{
  ats_score: number (0-100),
  matched_keywords: [...],
  missing_keywords: [...],
  recommendations: [...]
}`,
  inputVariables: ["user_data", "parsed_jd"],
});

const atsChain = new LLMChain({
  llm,
  prompt: atsPrompt,
  outputKey: "analysis",
});

const rewritePrompt = new PromptTemplate({
  template: `You're a resume optimization expert.

Given:
- User's resume: {user_data}
- Job description insights: {parsed_jd}

Rewrite the resume's experience and skills sections to:
- Match the job requirements
- Use action-result phrasing
- Naturally include keywords
- Stay professional and authentic

Return optimized resume content in JSON:
{
  summary: "...",
  experience: [...],
  skills: [...]
}`,
  inputVariables: ["user_data", "parsed_jd"],
});
const rewriteChain = new LLMChain({
  llm,
  prompt: rewritePrompt,
  outputKey: "optimized_resume_sections",
});

export const resumeOptimizerChain = new SequentialChain({
  chains: [jdParsingChain, atsChain, rewriteChain],
  inputVariables: ["job_description", "user_data"],
  outputVariables: [
    "parsed_jd",
    "analysis",
    "optimized_resume_sections",
  ],
});

