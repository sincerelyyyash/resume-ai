'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Testimonials', href: '/#testimonials' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    { name: 'GitHub', href: 'https://github.com/sincerelyyyash', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/sincerelyyyash', icon: Linkedin },
    { name: 'Twitter', href: 'https://twitter.com/sincerelyyyash', icon: Twitter },
    { name: 'Email', href: 'mailto:yash@resume-ai.com', icon: Mail },
  ],
};

export const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-zinc-600 dark:text-zinc-400">Email: contact@resume-ai.com</p>
              <p className="text-zinc-600 dark:text-zinc-400">Website: www.resume-ai.com</p>
              <p className="text-zinc-600 dark:text-zinc-400">Location: Remote</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Connect With Us</h3>
            <div className="grid grid-cols-2 gap-4">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-sm">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Developed with ❤️ by{' '}
                <Link
                  href="https://sincerelyyyash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-block"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="relative z-10 font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    Yash Thakur
                  </motion.span>
                  <motion.span
                    className="absolute bottom-0 left-0 h-1 w-full bg-blue-200 dark:bg-blue-800 opacity-50 group-hover:opacity-100 transition-opacity"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              © {new Date().getFullYear()} Resume-AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
