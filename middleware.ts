/**
 * Security Middleware - Deligo Website
 * 
 * SECURITY COMPLIANCE:
 * - OWASP ASVS v4.0
 * - NIST SP 800-53 (Security Controls)
 * - ISO 27001 A.14 (System Security)
 * - CWE/SANS Top 25
 * 
 * Applies security headers and protections following admin panel standards
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting storage (in-memory for demo, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Configuration
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100 // Max requests per window
const RATE_LIMIT_STRICT_ENDPOINTS = {
  '/api': 30, // API routes: 30 req/min
}

/**
 * Simple rate limiter
 */
function checkRateLimit(identifier: string, max: number = RATE_LIMIT_MAX_REQUESTS): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (record.count >= max) {
    return false
  }
  
  record.count++
  return true
}

/**
 * Clean up old rate limit entries (prevent memory leak)
 */
function cleanupRateLimits() {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanupRateLimits, 300000)

export function middleware(request: NextRequest) {
  // Get backend URL from environment variable
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  // Get client identifier from headers (Edge Runtime doesn't have request.ip)
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                   request.headers.get('x-real-ip') ||
                   'unknown'
  
  // Check rate limit for specific endpoints
  let rateLimit = RATE_LIMIT_MAX_REQUESTS
  for (const [path, limit] of Object.entries(RATE_LIMIT_STRICT_ENDPOINTS)) {
    if (request.nextUrl.pathname.startsWith(path)) {
      rateLimit = limit
      break
    }
  }
  
  if (!checkRateLimit(clientIp, rateLimit)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': rateLimit.toString(),
        'X-RateLimit-Remaining': '0',
      },
    })
  }
  
  // Create response with security headers
  const response = NextResponse.next()
  
  // OWASP ASVS V14.4: HTTP Security Headers
  
  // Strict-Transport-Security (HSTS) - Force HTTPS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  
  // X-Frame-Options - Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // X-Content-Type-Options - Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // X-XSS-Protection - Enable XSS filter (legacy but still useful)
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer-Policy - Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions-Policy - Control browser features
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()'
  )
  
  // Content-Security-Policy - Prevent XSS and injection attacks
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    `connect-src 'self' ${backendUrl} https://*.onrender.com http://localhost:* ws://localhost:*`, // ✅ Dynamic backend URL
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ]
  
  // Tighten CSP for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Content-Security-Policy', cspDirectives.join('; '))
  } else {
    response.headers.set('Content-Security-Policy-Report-Only', cspDirectives.join('; '))
  }
  
  // X-DNS-Prefetch-Control - Control DNS prefetching
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  
  // Cross-Origin policies - relaxed for cross-origin API access
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
  
  // Cache-Control for security-sensitive pages
  if (request.nextUrl.pathname.includes('/register') || request.nextUrl.pathname.includes('/api')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }
  
  return response
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)).*)',
  ],
}
