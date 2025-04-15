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
    <footer className="w-full pt-10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Connect</h3>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
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
                    className="relative z-10 font-semibold text-zinc-900 dark:text-zinc-100"
                  >
                    Yash Thakur
                  </motion.span>
                  <motion.span
                    className="absolute bottom-0 left-0 h-2 w-full bg-blue-200 dark:bg-blue-800 opacity-50 group-hover:opacity-100 transition-opacity"
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
