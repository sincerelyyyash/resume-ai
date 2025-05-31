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
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Appbar() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname === "/") {
    return null;
  }

  const navItems = isAuthenticated
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

  if (isLoading) {
    return (
      <div className="w-full ">
        <Navbar>
          <NavBody className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between w-full">
              <NavbarLogo />
              <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </NavBody>
        </Navbar>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-8">
              <NavbarLogo />
              {isAuthenticated && (
                <NavItems 
                items={navItems} 
                className="flex space-x-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 text-sm font-medium transition-colors"
              />
              
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {!isAuthenticated && pathname !== "/signin" && pathname !== "/signup" && (
                <>
                  {/* <Link href="/signup">
                    <Button variant="outline" size="sm" className="border-zinc-200 dark:border-zinc-800">
                      Sign Up
                    </Button>
                  </Link> */}
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
                {!isAuthenticated && (
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
                />
              </div>
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="max-w-4xl mx-auto px-4 py-4 border-t border-zinc-200 dark:border-zinc-800"
          >
            {isAuthenticated &&
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
