"use client";

import MotionDiv from "../motion-div";
import Image from "next/image";
import { Linkedin, Github, Globe, User } from "lucide-react";

interface UserProfileHeaderProps {
  name: string;
  email: string;
  bio?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  image?: string | null;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  name,
  email,
  bio,
  linkedin,
  github,
  portfolio,
  image,
}) => {
  return (
    <MotionDiv className="flex flex-col max-w-5xl sm:flex-row-reverse items-center sm:items-start gap-6 bg-white dark:bg-zinc-900 px-16 py-6 rounded-lg">
      <div className="relative w-32 h-32">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="rounded-full object-cover border-4 border-gray-200 dark:border-zinc-700"
            sizes="(max-width: 128px) 100vw, 128px"
            priority
          />
        ) : (
          <div className="w-full h-full rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border-4 border-gray-200 dark:border-zinc-700">
            <User className="h-16 w-16 text-zinc-400 dark:text-zinc-600" />
          </div>
        )}
      </div>

      <div className="text-center sm:text-left flex-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
          {name}
        </h1>
        {bio && (
          <p className="text-lg text-neutral-600 dark:text-neutral-300 italic mt-1">
            {bio}
          </p>
        )}
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">{email}</p>

        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black transition shadow hover:opacity-90"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black transition shadow hover:opacity-90"
            >
              <Github className="h-6 w-6" />
            </a>
          )}
          {portfolio && (
            <a
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black transition shadow hover:opacity-90"
            >
              <Globe className="h-6 w-6" />
            </a>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

export default UserProfileHeader;
