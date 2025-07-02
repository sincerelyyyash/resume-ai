"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";

// Production constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const UPLOAD_TIMEOUT = 60000; // 60 seconds
const SAVE_TIMEOUT = 30000; // 30 seconds

interface ParsedDataPreview {
  user: {
    name?: string;
    bio?: string;
    portfolio?: string;
    linkedin?: string;
    github?: string;
  };
  projects: Array<{ title: string; description: string; technologies: string[] }>;
  experiences: Array<{ title: string; company: string; description: string }>;
  education: Array<{ institution: string; degree: string; field: string }>;
  skills: Array<{ name: string; category: string; level: string }>;
  certifications: Array<{ title: string; issuer: string }>;
}

interface ResumeUploadProps {
  onSuccess?: () => void;
  onProcessingChange?: (isProcessing: boolean) => void;
}

const ResumeUpload = ({ onSuccess, onProcessingChange }: ResumeUploadProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedDataPreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  // Notify parent component when processing state changes
  const updateProcessingState = (uploading: boolean, saving: boolean) => {
    const isProcessing = uploading || saving;
    onProcessingChange?.(isProcessing);
  };

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file is not empty
    if (file.size === 0) {
      toast({
        title: "Empty file",
        description: "Please upload a file with content",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    updateProcessingState(true, isSaving);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("autoSave", "false");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);

      const response = await fetch("/api/user/process-resume", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again.');
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error status codes
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (response.status === 401) {
          throw new Error('Please sign in to upload a resume.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      if (data.success && data.data) {
        setParsedData(data.data);
        setShowPreview(true);
        toast({
          title: "Resume Processed Successfully",
          description: data.message || "Review the extracted data below and save to update your profile.",
        });
      } else {
        throw new Error(data.error || "Failed to process resume");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast({
            title: "Request timeout",
            description: "File processing took too long. Please try with a smaller file.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Processing failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Unexpected error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUploading(false);
      updateProcessingState(false, isSaving);
    }
  };

  const handleSaveData = async () => {
    if (!parsedData) return;

    setIsSaving(true);
    updateProcessingState(isUploading, true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SAVE_TIMEOUT);

      const response = await fetch("/api/user/save-resume-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again.');
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error status codes
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (response.status === 401) {
          throw new Error('Session expired. Please sign in again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(data.error || data.message || `Server error: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Resume data saved successfully! Your profile has been updated.",
      });

      // Clear preview and call success callback
      setParsedData(null);
      setShowPreview(false);
      
      if (onSuccess) {
        await onSuccess();
      } else {
        // Reload after a short delay to show success message
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast({
            title: "Request timeout",
            description: "Saving took too long. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Save failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Unexpected error",
          description: "An unexpected error occurred while saving. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
      updateProcessingState(isUploading, false);
    }
  };

  const handleCancelPreview = () => {
    setParsedData(null);
    setShowPreview(false);
  };

  return (
    <div className="mb-8">
      {!showPreview && (
        <div className="w-full">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center p-10">
              <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Processing your resume...
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <FileUpload 
                onChange={handleFileUpload}
              />
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Upload your resume (PDF or DOCX) and we&apos;ll automatically extract your information
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Maximum file size: 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {showPreview && parsedData && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Review Extracted Data</h3>
            <div className="space-x-2">
              <button
                onClick={handleCancelPreview}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSaveData}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                {isSaving ? "Saving..." : "Save Data"}
              </button>
            </div>
          </div>

          {/* Preview sections */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Info */}
            {parsedData.user && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Personal Information</h4>
                <div className="space-y-1 text-sm">
                  {parsedData.user.name && <p><strong>Name:</strong> {parsedData.user.name}</p>}
                  {parsedData.user.bio && <p><strong>Bio:</strong> {parsedData.user.bio}</p>}
                  {parsedData.user.linkedin && <p><strong>LinkedIn:</strong> {parsedData.user.linkedin}</p>}
                  {parsedData.user.github && <p><strong>GitHub:</strong> {parsedData.user.github}</p>}
                  {parsedData.user.portfolio && <p><strong>Portfolio:</strong> {parsedData.user.portfolio}</p>}
                </div>
              </div>
            )}

            {/* Skills */}
            {parsedData.skills && parsedData.skills.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Skills ({parsedData.skills.length})</h4>
                <div className="space-y-1 text-sm">
                  {parsedData.skills.slice(0, 5).map((skill, index) => (
                    <p key={index}>{skill.name} - {skill.level}</p>
                  ))}
                  {parsedData.skills.length > 5 && (
                    <p className="text-gray-500">...and {parsedData.skills.length - 5} more</p>
                  )}
                </div>
              </div>
            )}

            {/* Experience */}
            {parsedData.experiences && parsedData.experiences.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Experience ({parsedData.experiences.length})</h4>
                <div className="space-y-2 text-sm">
                  {parsedData.experiences.slice(0, 3).map((exp, index) => (
                    <div key={index}>
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                    </div>
                  ))}
                  {parsedData.experiences.length > 3 && (
                    <p className="text-gray-500">...and {parsedData.experiences.length - 3} more</p>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Education ({parsedData.education.length})</h4>
                <div className="space-y-2 text-sm">
                  {parsedData.education.slice(0, 3).map((edu, index) => (
                    <div key={index}>
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                    </div>
                  ))}
                  {parsedData.education.length > 3 && (
                    <p className="text-gray-500">...and {parsedData.education.length - 3} more</p>
                  )}
                </div>
              </div>
            )}

            {/* Projects */}
            {parsedData.projects && parsedData.projects.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Projects ({parsedData.projects.length})</h4>
                <div className="space-y-2 text-sm">
                  {parsedData.projects.slice(0, 3).map((project, index) => (
                    <div key={index}>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">{project.technologies.join(", ")}</p>
                    </div>
                  ))}
                  {parsedData.projects.length > 3 && (
                    <p className="text-gray-500">...and {parsedData.projects.length - 3} more</p>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {parsedData.certifications && parsedData.certifications.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Certifications ({parsedData.certifications.length})</h4>
                <div className="space-y-2 text-sm">
                  {parsedData.certifications.slice(0, 3).map((cert, index) => (
                    <div key={index}>
                      <p className="font-medium">{cert.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                    </div>
                  ))}
                  {parsedData.certifications.length > 3 && (
                    <p className="text-gray-500">...and {parsedData.certifications.length - 3} more</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload; 