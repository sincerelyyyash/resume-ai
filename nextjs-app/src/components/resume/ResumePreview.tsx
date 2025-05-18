import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pdfData, setPdfData] = useState<{ url: string; filename: string } | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const storedPdfData = localStorage.getItem('resumePdf');
    if (storedPdfData) {
      setPdfData(JSON.parse(storedPdfData));
    }
    setIsLoading(false);
  }, []);

  const handleDownload = async () => {
    if (!pdfData?.url) return;

    try {
      setIsDownloading(true);
      setDownloadError(null);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = pdfData.url;
      link.target = '_blank';
      link.download = pdfData.filename || 'resume.pdf';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      setDownloadError('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Generating your optimized resume...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-xl"
    >
      {/* Back to Dashboard Button */}
      <div className="mb-6">
        <Button
          onClick={() => router.push('/dashboard')}
          variant="ghost"
          className="flex items-center space-x-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Analysis */}
        <div className="space-y-8">
          {/* ATS Score and Analysis */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">ATS Optimization Score: {atsScore}%</h2>
            
            {/* Content Alignment Scores */}
            {contentAnalysis && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Content Alignment</h3>
                <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-4">
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
        </div>

        {/* Right Column - PDF Preview */}
        {pdfData && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Your Optimized Resume</h2>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  onClick={handleDownload}
                  className="flex items-center space-x-2"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </Button>
                {downloadError && (
                  <p className="text-sm text-red-500">{downloadError}</p>
                )}
              </div>
            </div>
            <div className="aspect-[3/4] w-full">
              <iframe
                src={`${pdfData.url}#toolbar=0`}
                className="w-full h-full rounded-lg border border-zinc-200 dark:border-zinc-700"
                title="Resume Preview"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 