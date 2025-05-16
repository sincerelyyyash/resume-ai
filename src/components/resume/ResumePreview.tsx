import { motion } from "framer-motion";

interface Experience {
  title: string;
  company: string;
  duration: string;
  achievements: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

interface ResumeData {
  summary: string;
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

interface Recommendations {
  experience: string[];
  skills: string[];
  education: string[];
  summary: string;
  format: string[];
}

interface ContentAnalysis {
  experience_alignment: number;
  skills_alignment: number;
  project_relevance: number;
  education_relevance: number;
}

interface ResumePreviewProps {
  data: ResumeData;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations?: Recommendations;
  contentAnalysis?: ContentAnalysis;
}

export default function ResumePreview({ 
  data, 
  atsScore = 0, 
  matchedKeywords = [], 
  missingKeywords = [],
  recommendations,
  contentAnalysis
}: ResumePreviewProps) {
  // Ensure data has all required fields with default values
  const safeData = {
    summary: data?.summary || '',
    experience: data?.experience || [],
    projects: data?.projects || [],
    skills: data?.skills || []
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg"
    >
      {/* ATS Score and Analysis */}
      <div className="mb-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">ATS Optimization Score: {atsScore}%</h2>
        
        {/* Content Alignment Scores */}
        {contentAnalysis && (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Content Alignment</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-700 rounded">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Experience</p>
                <p className="text-lg font-semibold">{contentAnalysis.experience_alignment}%</p>
              </div>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-700 rounded">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Skills</p>
                <p className="text-lg font-semibold">{contentAnalysis.skills_alignment}%</p>
              </div>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-700 rounded">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Projects</p>
                <p className="text-lg font-semibold">{contentAnalysis.project_relevance}%</p>
              </div>
              <div className="p-2 bg-zinc-100 dark:bg-zinc-700 rounded">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Education</p>
                <p className="text-lg font-semibold">{contentAnalysis.education_relevance}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Keywords Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Matched Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {matchedKeywords?.map((keyword, index) => (
                <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
              {matchedKeywords?.length === 0 && (
                <span className="text-zinc-500 dark:text-zinc-400">No matched keywords found</span>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords?.map((keyword, index) => (
                <span key={index} className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
              {missingKeywords?.length === 0 && (
                <span className="text-zinc-500 dark:text-zinc-400">No missing keywords found</span>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Recommendations</h3>
            <div className="space-y-4">
              {recommendations.experience.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Experience</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.experience.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              {recommendations.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Skills</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.skills.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              {recommendations.education.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Education</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.education.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              {recommendations.summary && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Summary</h4>
                  <p className="text-sm">{recommendations.summary}</p>
                </div>
              )}
              {recommendations.format.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Format</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.format.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Resume Content */}
      <div className="space-y-8">
        {/* Summary */}
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Professional Summary</h2>
          <p className="text-zinc-700 dark:text-zinc-300">{safeData.summary}</p>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Professional Experience</h2>
          <div className="space-y-6">
            {safeData.experience.map((exp, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{exp.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">{exp.company}</p>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">{exp.duration}</p>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-zinc-700 dark:text-zinc-300">{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
            {safeData.experience.length === 0 && (
              <p className="text-zinc-500 dark:text-zinc-400">No experience entries found</p>
            )}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Projects</h2>
          <div className="space-y-6">
            {safeData.projects.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300">{project.description}</p>
                <ul className="list-disc list-inside space-y-1">
                  {project.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-zinc-700 dark:text-zinc-300">{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
            {safeData.projects.length === 0 && (
              <p className="text-zinc-500 dark:text-zinc-400">No projects found</p>
            )}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {safeData.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                {skill}
              </span>
            ))}
            {safeData.skills.length === 0 && (
              <p className="text-zinc-500 dark:text-zinc-400">No skills found</p>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
} 