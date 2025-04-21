"use client";

import MotionDiv from "../motion-div";

interface Props {
  name: string;
  bio: string;
  email: string;
  image?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

const UserProfileHeader: React.FC<Props> = ({
  name,
  bio,
  email,
  image,
  linkedin,
  github,
  portfolio,
}) => {
  return (
    <MotionDiv className="flex flex-col max-w-5xl sm:flex-row-reverse items-center sm:items-start gap-6 bg-white dark:bg-zinc-900 px-16 py-6 rounded-lg">
      <img
        src={image || "/default-avatar.png"}
        alt={`${name}'s avatar`}
        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-zinc-700"
      />

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
              className="px-4 py-1 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black transition shadow"
            >
              LinkedIn
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black transition shadow"
            >
              GitHub
            </a>
          )}
          {portfolio && (
            <a
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black transition shadow"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

export default UserProfileHeader;
