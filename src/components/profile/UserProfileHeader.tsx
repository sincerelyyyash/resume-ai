"use client";

import { useState } from "react";
import MotionDiv from "../motion-div";
import { Linkedin, Github, Globe, User, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [formData, setFormData] = useState<UserData>(userData);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/user/update-basic-info", {
        name: formData.name,
        bio: formData.bio,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
      });

      await onSave();
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <MotionDiv className="relative flex flex-col max-w-5xl sm:flex-row-reverse items-center sm:items-start gap-6 bg-white dark:bg-zinc-900 px-16 py-6 rounded-lg">
      
      {/* Edit / Save / Cancel Button Positioned Absolutely */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {isEditing ? (
          <>
            <Button
              onClick={handleSave}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-lg"
            >
              <Save className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 px-4 py-2 rounded-lg"
            >
              <X className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-lg"
          >
            <Edit2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="text-center sm:text-left flex-1">
        {isEditing ? (
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="text-3xl font-bold text-gray-900 dark:text-neutral-100 bg-transparent border-b border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white"
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
            placeholder="Add a bio"
            className="w-full mt-4 text-lg text-neutral-600 dark:text-neutral-300 italic bg-transparent border-b border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white min-h-[24px]"
          />
        ) : (
          formData.bio && (
            <p className="text-lg text-neutral-600 dark:text-neutral-300 italic mt-1">
              {formData.bio}
            </p>
          )
        )}

        <p className="text-neutral-500 dark:text-neutral-400 mt-1">{formData.email}</p>

        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
          {isEditing ? (
            <>
              <input
                name="linkedin"
                value={formData.linkedin || ""}
                onChange={handleChange}
                placeholder="LinkedIn URL"
                className="px-4 py-1 text-sm font-medium rounded-full bg-transparent border border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white"
              />
              <input
                name="github"
                value={formData.github || ""}
                onChange={handleChange}
                placeholder="GitHub URL"
                className="px-4 py-1 text-sm font-medium rounded-full bg-transparent border border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white"
              />
              <input
                name="portfolio"
                value={formData.portfolio || ""}
                onChange={handleChange}
                placeholder="Portfolio URL"
                className="px-4 py-1 text-sm font-medium rounded-full bg-transparent border border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-black dark:focus:border-white"
              />
            </>
          ) : (
            <>
              {formData.linkedin && (
                <a
                  href={formData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black transition shadow hover:opacity-90"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {formData.github && (
                <a
                  href={formData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black transition shadow hover:opacity-90"
                >
                  <Github className="h-6 w-6" />
                </a>
              )}
              {formData.portfolio && (
                <a
                  href={formData.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black transition shadow hover:opacity-90"
                >
                  <Globe className="h-6 w-6" />
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

export default UserProfileHeader;
