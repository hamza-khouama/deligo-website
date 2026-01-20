# deligo-website

## Security & Compliance ⚠️🔒

This website implements **security-first architecture** compliant with international standards:

### Standards Compliance
- ✅ **OWASP ASVS v4.0** - Application Security Verification Standard (Level 2)
- ✅ **NIST SP 800-63B** - Digital Identity Guidelines (password requirements, MFA)
- ✅ **NIST SP 800-52 Rev.2** - TLS Configuration (HTTPS enforcement)
- ✅ **ISO 27001** - Information Security Management (A.8 Asset Management, A.10 Cryptography, A.13 Communications, A.14 Security Requirements)
- ✅ **GDPR Article 32** - Security of Processing (encryption, watermarking, data minimization)
- ✅ **OWASP SCP** - Secure Coding Practices (input validation, output encoding)
- ✅ **CWE-319** - Cleartext Transmission Prevention
- ✅ **CWE-601** - URL Redirection to Untrusted Site Prevention
- ✅ **CVE Mitigation** - Regular dependency updates and security patches

### Environment Configuration

**Required Variables:**
```bash
# Authentication Service (handles OTP, login, token management)
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth-service-bc5l.onrender.com

# Driver Service (handles driver registration and profile)
NEXT_PUBLIC_DRIVER_SERVICE_URL=https://driver-service-dy7i.onrender.com

# Comma-separated whitelist of allowed API hosts (production-only)
NEXT_PUBLIC_ALLOWED_API_HOSTS=auth-service-bc5l.onrender.com,driver-service-dy7i.onrender.com

# Deployment environment (set to 'production' in prod)
NODE_ENV=production
```

**🚨 Critical Security Rules:**
1. **NO hardcoded URLs** - All service URLs come from environment variables
2. **HTTPS in production** - HTTP connections are blocked (NIST SP 800-52)
3. **Host whitelisting** - Only approved domains are allowed (CWE-601 prevention)
4. **Fail-fast validation** - Invalid configurations prevent startup in production

### Backend Service Requirements

Both microservices MUST implement:

**TLS & Transport Security:**
- TLS v1.2+ with modern cipher suites
- HSTS header (`Strict-Transport-Security: max-age=31536000; includeSubDomains`)
- Disable insecure protocols (SSLv3, TLS 1.0, TLS 1.1)

**CORS Configuration:**
```python
# Only allow trusted origins
ALLOWED_ORIGINS = [
    "https://deligo.tn",
    "https://www.deligo.tn",
]
```

**Rate Limiting (OWASP API Security):**
- OTP endpoints: 3 requests/minute per IP
- Registration: 5 requests/hour per IP
- Login: 5 failed attempts = 15min lockout

**Input Validation:**
- Server-side validation for ALL inputs (never trust client)
- Content-Type enforcement (`application/json` only)
- Size limits: 10MB per document, 50MB per request
- File type validation (magic bytes, not just extensions)

**Authentication & Authorization:**
- JWT tokens with 15-minute expiry
- Registration tokens expire after 15 minutes (NIST)
- Password requirements: min 8 chars, complexity rules
- Secure password hashing (bcrypt/Argon2 with salt)

**Audit Logging:**
- Log all authentication attempts
- Log document uploads with metadata hashes
- Log account creation with IP and timestamp
- Retain logs for GDPR compliance (30 days minimum)

**Data Protection (GDPR Article 32):**
- Encrypt PII at rest (AES-256)
- Watermark uploaded documents server-side
- Data minimization (only collect necessary data)
- Right to erasure implementation
- Breach notification procedures

### Client-Side Security Features

**Document Security:**
- ✅ Visible watermarks (user email masked + timestamp)
- ✅ Invisible LSB steganography watermarks
- ✅ AES-256-GCM encryption (optional)
- ✅ SHA-256 integrity hashing

**Input Validation:**
- Email format (RFC 5322)
- Phone number (8-15 digits)
- Password strength meter (NIST SP 800-63B)
- License plate format (TU/RS)
- Document type/size checks

**XSS/CSRF Prevention:**
- CSP headers
- Input sanitization
- Output encoding
- SameSite cookies

### Responsive Design ✅

Fully responsive across devices:
- 📱 Mobile (320px - 640px)
- 📱 Tablet (640px - 1024px)
- 💻 Desktop (1024px+)

Components use Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`) and flexible layouts.

### Development Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

### Security Auditing

Run security checks regularly:
```bash
# Dependency vulnerabilities
pnpm audit

# TypeScript type safety
pnpm type-check

# Linting (includes security rules)
pnpm lint
```

### Incident Response

If a security issue is discovered:
1. **DO NOT** open a public issue
2. Email security contact: [security@deligo.tn]
3. Include: description, reproduction steps, impact assessment
4. Response time: 24 hours for critical, 72 hours for non-critical

### Compliance Checklist for Production

- [ ] All environment variables set correctly
- [ ] HTTPS enforced (no HTTP)
- [ ] Host whitelist configured
- [ ] CORS restricted on backend
- [ ] Rate limiting active
- [ ] Audit logging enabled
- [ ] TLS v1.2+ with HSTS
- [ ] CSP headers configured
- [ ] Document watermarking working
- [ ] Password policy enforced
- [ ] Data retention policy documented
- [ ] Breach notification process ready

---

**Last Updated:** January 2026  
**Security Contact:** [security@deligo.tn]  
**Compliance Officer:** [compliance@deligo.tn]

