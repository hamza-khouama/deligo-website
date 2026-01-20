# Website Registration Bug Fixes - Summary

**Date:** January 19, 2026  
**Status:** ✅ Fixed and Ready for Testing

---

## Issues Identified

### 1. OTP Purpose Validation Error (422 Unprocessable Content)
**Symptom:**
```
Database session error: 1 validation error:
  {'type': 'string_pattern_mismatch', 'loc': ('body', 'purpose'), 
   'msg': "String should match pattern '^(verification|password_reset)$'", 
   'input': 'registration'}
```

**Root Cause:**
The auth service `/auth/otp/send` endpoint only accepts:
- `"verification"` - for email verification during registration
- `"password_reset"` - for password reset flow

The frontend was incorrectly sending `purpose: "registration"`.

**Fix Applied:**
- Changed `OTPSendRequest` interface purpose type from `'registration' | 'password_reset'` to `'verification' | 'password_reset'`
- Updated `resendOTP()` function to use `purpose: 'verification'`

**Files Modified:**
- `lib/services/driver-registration-api.ts` (lines 24-26, 351)

---

### 2. Vehicle Types 404 Error
**Symptom:**
```
ApiError: Not Found
    at handleResponse (driver-registration-api.ts:58:21)
```

**Root Cause:**
The frontend was trying to fetch vehicle types from `/api/public/vehicle-types/`, but this endpoint doesn't exist in the driver service.

**Temporary Fix:**
Hardcoded vehicle types in the frontend to match backend validation:
- standard
- premium
- suv
- van
- luxury
- bike

**Long-term Solution:**
Backend team should add a public endpoint (see `BACKEND_IMPROVEMENTS_NEEDED.md`)

**Files Modified:**
- `lib/services/driver-registration-api.ts` (lines 133-169)

---

### 3. Other 404 Errors (Non-Critical)
**Endpoints with 404:**
- `/auth/test` - This endpoint doesn't exist (expected)
- `/auth/health` - Correct endpoint is `/health` (without `/auth` prefix)

These are informational only and don't affect registration flow.

---

## Changes Summary

### Modified Files
1. **lib/services/driver-registration-api.ts**
   - Line 25: Changed OTP purpose type to `'verification' | 'password_reset'`
   - Lines 133-169: Hardcoded vehicle types with detailed comments
   - Line 351: Updated resendOTP to use `'verification'`

### New Files
2. **Backend-new-deligo/services/driver-service/BACKEND_IMPROVEMENTS_NEEDED.md**
   - Documentation for backend team about missing vehicle types endpoint
   - Code examples for implementation

---

## Testing Instructions

### Prerequisites
```bash
cd deligo-website
pnpm install  # if not already done
```

### Set Environment Variables
Ensure `.env.local` has:
```env
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth-service-bc5l.onrender.com
NEXT_PUBLIC_DRIVER_SERVICE_URL=https://driver-service-dy7i.onrender.com
```

### Start Development Server
```bash
pnpm dev
```

### Test Registration Flow
1. Open http://localhost:3000
2. Click "Become a Driver" or registration button
3. Enter email address
4. Click "Send OTP"
   - **Expected:** ✅ OTP sent successfully (no 422 error)
   - **Previous:** ❌ 422 Unprocessable Content error
5. Check email for OTP code
6. Enter OTP and verify
   - **Expected:** ✅ Proceeds to password step
7. Complete remaining steps (password, vehicle selection, documents)
   - **Expected:** ✅ Vehicle types appear (standard, premium, suv, van, luxury, bike)
   - **Previous:** ❌ 404 Not Found error
8. Submit registration
   - **Expected:** ✅ Driver registered successfully

---

## Backend Logs to Monitor

### Success Indicators
```
INFO: "POST /auth/otp/send HTTP/1.1" 200 OK
INFO: "POST /auth/otp/verify HTTP/1.1" 200 OK
INFO: "POST /drivers/register HTTP/1.1" 201 Created
```

### Error Indicators (Should NOT Appear)
```
❌ "POST /auth/otp/send HTTP/1.1" 422 Unprocessable Content
❌ Database session error: 1 validation error
❌ String should match pattern '^(verification|password_reset)$'
```

---

## Rollback Instructions

If issues persist, revert changes:
```bash
cd deligo-website
git checkout lib/services/driver-registration-api.ts
```

Then investigate backend service logs for additional errors.

---

## Next Steps

1. ✅ **Test the registration flow** with the fixes applied
2. 🔄 **Backend Team:** Review `BACKEND_IMPROVEMENTS_NEEDED.md` and implement vehicle types endpoint
3. 📝 **Frontend Team:** Once backend adds vehicle types endpoint, uncomment the TODO code in `fetchVehicleTypes()`
4. 🔒 **Security Team:** Review OTP flow to ensure it meets OWASP ASVS requirements

---

## Questions or Issues?

If you encounter any issues:
1. Check browser console for errors
2. Check backend service logs (auth-service and driver-service)
3. Verify environment variables are set correctly
4. Ensure backend services are running and accessible

---

**Status:** Ready for testing ✨
