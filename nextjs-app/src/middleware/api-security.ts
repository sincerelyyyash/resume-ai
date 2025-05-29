import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import * as htmlEscaper from 'html-escaper';
import sanitizeFilename from 'sanitize-filename';

// Initialize Redis client for rate limiting with fallback
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Create a new ratelimiter that allows 10 requests per 10 seconds
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  } else {
    console.warn('Redis configuration missing. Rate limiting will be disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Redis client:', error);
}

// In-memory rate limiting fallback
const inMemoryRateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 10 * 1000; // 10 seconds in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 10;

// Maximum request size (5MB)
const MAX_REQUEST_SIZE = 5 * 1024 * 1024;

// CORS configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Security headers configuration
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
};

// Sanitization configuration types
interface SanitizationOptions {
  allowHTML?: boolean;
  maxLength?: number;
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  escapeHTML?: boolean;
  trim?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
  removeSpecialChars?: boolean;
  allowedChars?: RegExp;
}

// Field-specific sanitization rules
const fieldSanitizationRules: Record<string, SanitizationOptions> = {
  // User profile fields
  name: { 
    maxLength: 100, 
    allowHTML: false, 
    trim: true,
    removeSpecialChars: true,
    allowedChars: /^[a-zA-Z\s-']+$/
  },
  email: { 
    maxLength: 254, 
    allowHTML: false, 
    trim: true,
    lowercase: true
  },
  bio: { 
    maxLength: 500, 
    allowHTML: true, 
    allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'li'],
    allowedAttributes: {
      'a': ['href', 'target', 'rel'],
      'strong': [],
      'em': []
    }
  },
  portfolio: { 
    maxLength: 2048, 
    allowHTML: false, 
    trim: true,
    escapeHTML: true
  },
  linkedin: { 
    maxLength: 2048, 
    allowHTML: false, 
    trim: true,
    escapeHTML: true
  },
  github: { 
    maxLength: 2048, 
    allowHTML: false, 
    trim: true,
    escapeHTML: true
  },

  // Project fields
  projectTitle: { 
    maxLength: 100, 
    allowHTML: false, 
    trim: true,
    removeSpecialChars: true
  },
  projectDescription: { 
    maxLength: 1000, 
    allowHTML: true, 
    allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'li'],
    allowedAttributes: {
      'a': ['href', 'target', 'rel']
    }
  },

  // Experience fields
  company: { 
    maxLength: 100, 
    allowHTML: false, 
    trim: true,
    removeSpecialChars: true
  },
  jobTitle: { 
    maxLength: 100, 
    allowHTML: false, 
    trim: true,
    removeSpecialChars: true
  },
  jobDescription: { 
    maxLength: 1000, 
    allowHTML: true, 
    allowedTags: ['p', 'br', 'strong', 'em', 'ul', 'li'],
    allowedAttributes: {
      'a': ['href', 'target', 'rel']
    }
  },

  // Education fields
  institution: { 
    maxLength: 100, 
    allowHTML: false, 
    trim: true,
    removeSpecialChars: true
  },
  degree: { 
    maxLength: 100, 
    allowHTML: false, 
    trim: true,
    removeSpecialChars: true
  },
  field: { 
    maxLength: 100, 
    allowHTML: false, 
    trim: true,
    removeSpecialChars: true
  }
};

// NoSQL injection prevention
const noSqlInjectionPatterns = [
  /\$ne/i,
  /\$gt/i,
  /\$lt/i,
  /\$gte/i,
  /\$lte/i,
  /\$in/i,
  /\$nin/i,
  /\$or/i,
  /\$and/i,
  /\$not/i,
  /\$nor/i,
  /\$exists/i,
  /\$type/i,
  /\$expr/i,
  /\$text/i,
  /\$search/i,
  /\$where/i,
  /\$regex/i,
  /\$options/i
];

// Basic HTML tag sanitization
function sanitizeHTML(html: string, allowedTags: string[] = [], allowedAttributes: Record<string, string[]> = {}): string {
  // Remove all HTML tags if no tags are allowed
  if (!allowedTags.length) {
    return htmlEscaper.escape(html);
  }

  // Create a simple regex to match allowed tags
  const tagRegex = new RegExp(`<(?!/?(${allowedTags.join('|')})[^>]*>)[^>]*>`, 'gi');
  let sanitized = html.replace(tagRegex, '');

  // Remove attributes from allowed tags
  for (const [tag, attrs] of Object.entries(allowedAttributes)) {
    const tagRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
    sanitized = sanitized.replace(tagRegex, (match) => {
      const allowedAttrRegex = new RegExp(`\\s(?!${attrs.join('|')})[^\\s=]+(?:=[^\\s>]+)?`, 'gi');
      return match.replace(allowedAttrRegex, '');
    });
  }

  return sanitized;
}

// Sanitize a single value based on field rules
function sanitizeValue(value: unknown, field?: string): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  const rules = field ? fieldSanitizationRules[field] : undefined;

  if (typeof value === 'string') {
    let sanitized = value;

    // Apply basic string sanitization
    if (rules?.trim) {
      sanitized = sanitized.trim();
    }
    if (rules?.lowercase) {
      sanitized = sanitized.toLowerCase();
    }
    if (rules?.uppercase) {
      sanitized = sanitized.toUpperCase();
    }
    if (rules?.removeSpecialChars && rules.allowedChars) {
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s-']/g, '');
    }
    if (rules?.maxLength) {
      sanitized = sanitized.slice(0, rules.maxLength);
    }

    // Check for NoSQL injection
    if (noSqlInjectionPatterns.some(pattern => pattern.test(sanitized))) {
      throw new Error(`Potential NoSQL injection detected in field: ${field}`);
    }

    // Apply HTML sanitization
    if (rules?.allowHTML) {
      sanitized = sanitizeHTML(sanitized, rules.allowedTags, rules.allowedAttributes);
    } else if (rules?.escapeHTML) {
      sanitized = htmlEscaper.escape(sanitized);
    }

    return sanitized;
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item, field));
  }

  if (typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val, key);
    }
    return sanitized;
  }

  return value;
}

// Sanitize file upload
function sanitizeFile(file: File): File {
  const sanitizedFilename = sanitizeFilename(file.name);
  return new File([file], sanitizedFilename, {
    type: file.type,
    lastModified: file.lastModified
  });
}

// Main sanitization function
export function sanitizeInput<T>(data: T, field?: string): T {
  try {
    if (data instanceof File) {
      return sanitizeFile(data) as unknown as T;
    }
    return sanitizeValue(data, field) as T;
  } catch (error) {
    console.error('Sanitization error:', error);
    throw new Error(`Sanitization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Request size validation
export async function validateRequestSize(request: NextRequest) {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
    return NextResponse.json(
      { error: 'Request entity too large' },
      { status: 413 }
    );
  }
  return null;
}

// Rate limiting with fallback
export async function rateLimit(request: NextRequest) {
  // Get IP from headers or fallback to a default
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

  // Use Redis if available, otherwise fall back to in-memory rate limiting
  if (ratelimit) {
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            }
          }
        );
      }
    } catch (error) {
      console.error('Redis rate limiting failed, falling back to in-memory:', error);
      // Fall through to in-memory rate limiting
    }
  }

  // In-memory rate limiting fallback
  const now = Date.now();
  const userLimit = inMemoryRateLimit.get(ip);

  if (userLimit) {
    if (now > userLimit.resetTime) {
      // Reset if window has passed
      inMemoryRateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
      // Rate limit exceeded
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': userLimit.resetTime.toString(),
          }
        }
      );
    } else {
      // Increment counter
      userLimit.count++;
      inMemoryRateLimit.set(ip, userLimit);
    }
  } else {
    // First request
    inMemoryRateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }

  return null;
}

// CORS handling
export function handleCORS(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  return null;
}

// Request validation middleware
export function validateRequest(schema: z.ZodSchema) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json();
      const sanitizedBody = sanitizeInput(body);
      await schema.parseAsync(sanitizedBody);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
  };
}

// Apply security headers
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// Request logging
export async function logRequest(request: NextRequest, response: NextResponse) {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = request.url;
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const status = response.status;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${timestamp}] ${requestId} ${method} ${url} ${status} - IP: ${ip} - UA: ${userAgent}`);
  }

  // Add request ID to response headers
  response.headers.set('X-Request-ID', requestId);

  // TODO: In production, implement proper logging service (e.g., Winston, Pino)
  // This could be sent to a logging service or stored in a database
  return response;
}

// Error handling
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      },
      { status: 400 }
    );
  }

  // Handle unexpected errors
  return NextResponse.json(
    {
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  );
}

// Main API security middleware
export async function apiSecurity(
  request: NextRequest,
  schema?: z.ZodSchema
) {
  try {
    // Handle CORS
    const corsResponse = handleCORS(request);
    if (corsResponse) return logRequest(request, applySecurityHeaders(corsResponse));

    // Validate request size
    const sizeResponse = await validateRequestSize(request);
    if (sizeResponse) return logRequest(request, applySecurityHeaders(sizeResponse));

    // Apply rate limiting
    const rateLimitResponse = await rateLimit(request);
    if (rateLimitResponse) return logRequest(request, applySecurityHeaders(rateLimitResponse));

    // Validate request body if schema is provided
    if (schema && request.method !== 'GET') {
      const validationResponse = await validateRequest(schema)(request);
      if (validationResponse) return logRequest(request, applySecurityHeaders(validationResponse));
    }

    return null;
  } catch (error) {
    const errorResponse = handleError(error);
    return logRequest(request, applySecurityHeaders(errorResponse));
  }
} 