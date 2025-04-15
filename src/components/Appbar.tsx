"use client";

import React from "react";
import Link from "next/link";
import { ModeToggle } from "./ui/theme-toggle";
import { UserMenu } from "./ProfileDropdown";

const Appbar = () => {

  return (
    <nav className="flex justify-between items-center p-4 sticky">
      <Link href="/">
        <div
          className="text-lg md:text-2xl m-4 font-bold text-center bg-clip-text text-transparent
          bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50"
        >
          Resume-AI
        </div>
      </Link>
      <div className="flex space-x-4 items-center">
        {/* <ModeToggle /> */}
        <UserMenu />
      </div>
    </nav>
  );
};

export default Appbar;
