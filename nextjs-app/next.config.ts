import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  
  // Webpack configuration for text extraction libraries
  webpack: (config, { isServer }) => {
    // Only apply these configurations on the server side
    if (isServer) {
      // Configure externals for Node.js specific modules
      config.externals = config.externals || [];
      config.externals.push({
        'canvas': 'canvas',
      });
    }

    // Handle pdf-parse and related dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      crypto: false,
      buffer: false,
      util: false,
    };

    // Ignore warnings from pdf-parse about optional dependencies
    config.ignoreWarnings = [
      { message: /Critical dependency: the request of a dependency is an expression/ },
      { message: /Failed to parse source map/ },
    ];

    return config;
  },
  
  // Enable external packages for server components
  serverExternalPackages: ['pdf-parse', 'mammoth'],
};

export default nextConfig;
