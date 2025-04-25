"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { UserMenu } from "./ProfileDropdown";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Appbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = session
    ? [
        {
          name: "Dashboard",
          link: "/dashboard",
        },
        {
          name: "Profile",
          link: "/user/profile",
        },
      ]
    : [];

  return (
    <div className="w-full border-b border-zinc-200 dark:border-zinc-800">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-8">
              <NavbarLogo />
              {session && (
                <NavItems 
                  items={navItems} 
                  className="flex space-x-6"
                  itemClassName="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 text-sm font-medium transition-colors"
                />
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {!session && (
                <>
                  <Link href="/signup">
                    <Button variant="outline" size="sm" className="border-zinc-200 dark:border-zinc-800">
                      Sign Up
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button size="sm">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
              <UserMenu />
            </div>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between w-full">
              <NavbarLogo />
              <div className="flex items-center gap-4">
                {!session && (
                  <>
                    <Link href="/signup">
                      <Button variant="outline" size="sm" className="border-zinc-200 dark:border-zinc-800">
                        Sign Up
                      </Button>
                    </Link>
                    <Link href="/signin">
                      <Button size="sm">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
                <UserMenu />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-zinc-600 dark:text-zinc-400"
                />
              </div>
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="max-w-4xl mx-auto px-4 py-4 border-t border-zinc-200 dark:border-zinc-800"
          >
            {session &&
              navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  {item.name}
                </a>
              ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
