"use client";

import { useState } from "react";
import { MotionDiv } from "../landing/MotionDiv";
import { Linkedin, Github, Globe, Edit2, Save, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeUpload from "./ResumeUpload";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  bio: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  image: string | null;
}

interface UserProfileHeaderProps {
  userData: UserData;
  onSave: () => Promise<void>;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  userData,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState<UserData>(userData);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple simultaneous saves

    try {
      setIsSaving(true);
      
      await axios.post("/api/user/update-basic-info", {
        name: formData.name,
        bio: formData.bio,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
      });

      // Only call onSave if the API call was successful
      await onSave();
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving) return; // Prevent cancel during save
    setFormData(userData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (isSaving) return; // Prevent edit during save
    setIsEditing(true);
  };

  const handleUploadClick = () => {
    if (isSaving) return; // Prevent upload during save
    setShowUploadModal(true);
  };

  return (
    <>
      <MotionDiv className="relative flex flex-col max-w-5xl sm:flex-row-reverse items-center sm:items-start gap-6 bg-white dark:bg-zinc-900 px-16 py-6 rounded-lg">
        
        <div className="absolute top-4 right-4 flex space-x-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <Save className="h-5 w-5" />
                )}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isSaving}
                variant="outline"
                className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 px-4 py-2 rounded-lg"
              >
                <X className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleUploadClick}
                disabled={isSaving}
                variant="outline"
                className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span className="text-sm">Upload Resume</span>
              </Button>
              <Button
                onClick={handleEdit}
                disabled={isSaving}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-lg"
              >
                <Edit2 className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        <div className="text-center sm:text-left flex-1">
          {isEditing ? (
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSaving}
              className="text-3xl font-bold text-gray-900 dark:text-neutral-100 bg-transparent border-b border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white disabled:opacity-50"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {formData.name}
            </h1>
          )}

          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="Add a bio"
              className="w-full mt-4 text-lg text-neutral-600 dark:text-neutral-300 italic bg-transparent border-b border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white min-h-[24px] disabled:opacity-50"
            />
          ) : (
            <p className="text-lg text-neutral-600 dark:text-neutral-300 italic mt-1">
              {formData.bio || "No bio added yet. Click edit to add your bio."}
            </p>
          )}

          <p className="text-neutral-500 dark:text-neutral-400 mt-1">{formData.email}</p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
            {isEditing ? (
              <>
                <input
                  name="linkedin"
                  value={formData.linkedin || ""}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="LinkedIn URL"
                  className="px-4 py-1 text-sm font-medium rounded-full bg-transparent border border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white disabled:opacity-50"
                />
                <input
                  name="github"
                  value={formData.github || ""}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="GitHub URL"
                  className="px-4 py-1 text-sm font-medium rounded-full bg-transparent border border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white disabled:opacity-50"
                />
                <input
                  name="portfolio"
                  value={formData.portfolio || ""}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="Portfolio URL"
                  className="px-4 py-1 text-sm font-medium rounded-full bg-transparent border border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white disabled:opacity-50"
                />
              </>
            ) : (
              <>
                <a
                  href={formData.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-1 text-sm font-medium rounded-full transition shadow hover:opacity-90 flex items-center gap-2 ${
                    formData.linkedin 
                      ? "bg-black text-white dark:bg-white dark:text-black" 
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    if (!formData.linkedin && !isSaving) {
                      e.preventDefault();
                      setIsEditing(true);
                    }
                  }}
                >
                  <Linkedin className="h-6 w-6" />
                  {!formData.linkedin && <span className="text-xs">Add LinkedIn</span>}
                </a>
                <a
                  href={formData.github || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-1 text-sm font-medium rounded-full transition shadow hover:opacity-90 flex items-center gap-2 ${
                    formData.github 
                      ? "bg-black text-white dark:bg-white dark:text-black" 
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    if (!formData.github && !isSaving) {
                      e.preventDefault();
                      setIsEditing(true);
                    }
                  }}
                >
                  <Github className="h-6 w-6" />
                  {!formData.github && <span className="text-xs">Add GitHub</span>}
                </a>
                <a
                  href={formData.portfolio || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-1 text-sm font-medium rounded-full transition shadow hover:opacity-90 flex items-center gap-2 ${
                    formData.portfolio 
                      ? "bg-black text-white dark:bg-white dark:text-black" 
                      : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 cursor-pointer"
                  }`}
                  onClick={(e) => {
                    if (!formData.portfolio && !isSaving) {
                      e.preventDefault();
                      setIsEditing(true);
                    }
                  }}
                >
                  <Globe className="h-6 w-6" />
                  {!formData.portfolio && <span className="text-xs">Add Portfolio</span>}
                </a>
              </>
            )}
          </div>
        </div>
      </MotionDiv>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
                Upload Resume
              </h2>
              {!isProcessing && (
                <Button
                  onClick={() => setShowUploadModal(false)}
                  variant="outline"
                  className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 p-2 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {isProcessing && (
              <div className="mx-6 mt-4 p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                      Please do not close this window
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your resume is being processed. This may take a few moments.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <ResumeUpload 
                onSuccess={async () => {
                  setShowUploadModal(false);
                  await onSave();
                }} 
                onProcessingChange={setIsProcessing}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileHeader;
