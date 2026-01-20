/**
 * Centralized API Configuration - Deligo Website
 * 
 * SECURITY COMPLIANCE:
 * - OWASP ASVS v4.0 (V1.4: Access Control Architecture)
 * - NIST SP 800-52 Rev.2 (TLS Configuration)
 * - ISO 27001 A.14.1 (Security Requirements)
 * - GDPR Article 32 (Security of Processing)
 * - CWE-319 (Cleartext Transmission Prevention)
 * - CWE-601 (URL Redirection to Untrusted Site)
 */

// Separate service URLs for microservices architecture
const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL
const DRIVER_SERVICE_URL = process.env.NEXT_PUBLIC_DRIVER_SERVICE_URL
const VEHICLE_TYPE_SERVICE_URL = process.env.NEXT_PUBLIC_VEHICLE_TYPE_SERVICE_URL

// Host whitelist (production-only enforcement)
const allowedHostsEnv = process.env.NEXT_PUBLIC_ALLOWED_API_HOSTS || 'auth-service-bc5l.onrender.com,driver-service-dy7i.onrender.com,vehicle-type-service.onrender.com'
const ALLOWED_HOSTS = allowedHostsEnv.split(',').map(h => h.trim()).filter(Boolean)

/**
 * Validate and normalize service URL
 * OWASP ASVS V5.1.3: URL Redirects and Forwards
 * CWE-601 Prevention
 */
function validateServiceUrl(urlStr: string | undefined, serviceName: string): string {
  if (!urlStr) {
    const error = `${serviceName} URL not configured. Set NEXT_PUBLIC_${serviceName.toUpperCase()}_SERVICE_URL`
    if (process.env.NODE_ENV === 'production') {
      throw new Error(error)
    }
    console.warn(`[config/api] ${error}`)
    return '' // Fail gracefully in dev
  }

  try {
    const url = new URL(urlStr)

    // NIST SP 800-52: Enforce TLS in production (CWE-319)
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
      throw new Error(`${serviceName} must use HTTPS in production (NIST SP 800-52)`)
    }

    // OWASP ASVS V1.4.1: Enforce host whitelist in production (CWE-601)
    const host = url.hostname
    if (process.env.NODE_ENV === 'production' && !ALLOWED_HOSTS.includes(host)) {
      throw new Error(
        `${serviceName} host "${host}" not in whitelist. Allowed: ${ALLOWED_HOSTS.join(', ')}`
      )
    }

    // Normalize: remove trailing slash
    return url.toString().replace(/\/$/, '')
  } catch (err) {
    console.error(`[config/api] Invalid ${serviceName} URL:`, err)
    if (process.env.NODE_ENV === 'production') {
      throw err // Fail fast in production
    }
    return urlStr // Return as-is in development
  }
}

// Validated service endpoints
export const AUTH_SERVICE_BASE = validateServiceUrl(AUTH_SERVICE_URL, 'AUTH')
export const DRIVER_SERVICE_BASE = validateServiceUrl(DRIVER_SERVICE_URL, 'DRIVER')
export const VEHICLE_TYPE_SERVICE_BASE = validateServiceUrl(VEHICLE_TYPE_SERVICE_URL, 'VEHICLE_TYPE')

// Legacy compatibility (deprecated - use specific service URLs)
export const API_BASE = DRIVER_SERVICE_BASE
export const API_ORIGIN = DRIVER_SERVICE_BASE

// Security metadata
export const API_ALLOWED_HOSTS = ALLOWED_HOSTS
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const REQUIRE_HTTPS = IS_PRODUCTION

// Security headers configuration
export const SECURITY_CONFIG = {
  requireHttps: REQUIRE_HTTPS,
  allowedHosts: ALLOWED_HOSTS,
  requestTimeout: 30000, // 30s default
  maxRetries: 3,
  csrfProtection: true,
} as const

export default {
  AUTH_SERVICE_BASE,
  DRIVER_SERVICE_BASE,
  VEHICLE_TYPE_SERVICE_BASE,
  API_BASE, // deprecated
  API_ORIGIN, // deprecated
  API_ALLOWED_HOSTS,
  IS_PRODUCTION,
  SECURITY_CONFIG,
}
