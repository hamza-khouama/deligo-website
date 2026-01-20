/**
 * Driver Registration API Service
 * 
 * SECURITY COMPLIANCE:
 * - OWASP API Security Top 10
 * - ISO 27001 A.13 Communications Security
 * - GDPR Article 32 Security of Processing
 * - NIST SP 800-63B Digital Identity Guidelines
 * - CWE-319 Cleartext Transmission Prevention
 * 
 * Handles all API communication for driver registration flow.
 */

import { AUTH_SERVICE_BASE, DRIVER_SERVICE_BASE, VEHICLE_TYPE_SERVICE_BASE, SECURITY_CONFIG } from '@/lib/config/api';

// Types
export interface VehicleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  icon?: string;
  color?: string;
  is_active: boolean;
  vehicle_types_count?: number;
}

export interface VehicleType {
  id: string | number;
  name: string;
  category_id?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  map_icon_url?: string;
  base_fare?: number;
  per_km_rate?: number;
  per_minute_rate?: number;
  max_passengers?: number;
  max_luggage?: number;
  features?: string[];
}

export interface OTPSendRequest {
  email: string;
  purpose: 'verification' | 'password_reset';
  user_type?: 'client' | 'driver' | 'admin';
  phone?: string;
  phone_number?: string;
  country_code?: string;
  full_name?: string;
}

export interface OTPSendResponse {
  success: boolean;
  message: string;
  expires_at?: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
  registration_token?: string;
  token_expires_at?: string;
}

export interface DriverRegistrationRequest {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  registration_token: string;
  vehicle_type_id?: number;
  license_plate?: string;
}

export interface EncryptedDocument {
  encrypted_data: string; // Base64 encoded
  iv: string; // Base64 encoded
  auth_tag?: string;
  encrypted_key: string; // Server public key encrypted
  document_type: string;
  original_filename: string;
  mime_type: string;
  checksum: string;
  watermark_id?: string;
}

export interface DriverRegistrationResponse {
  success: boolean;
  message: string;
  driver_id?: string;
  verification_status?: string;
}

export interface APIError {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  status: number;
  details?: Record<string, unknown> | undefined;

  constructor(status: number, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}


// Request timeout
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Create abort controller with timeout
 */
function createTimeoutController(timeout: number = REQUEST_TIMEOUT): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`;
    let details: Record<string, unknown> | undefined;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
      details = errorData;
    } catch {
      // Response is not JSON
    }
    
    const err = new ApiError(response.status, errorMessage, details);
    throw err;
  }
  
  return response.json();
}

/**
 * Fetch vehicle categories from vehicle-type service
 * 
 * SECURITY: Public endpoint, no authentication required
 */
export async function fetchVehicleCategories(): Promise<VehicleCategory[]> {
  const controller = createTimeoutController();
  
  try {
    const response = await fetch(`${VEHICLE_TYPE_SERVICE_BASE}/public/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    return handleResponse<VehicleCategory[]>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout - Could not fetch vehicle categories');
    }
    throw error;
  }
}

/**
 * Fetch vehicle types for a specific category
 * 
 * @param categoryId - UUID of the vehicle category
 */
export async function fetchVehicleTypesByCategory(categoryId: string): Promise<VehicleType[]> {
  const controller = createTimeoutController();
  
  try {
    const response = await fetch(
      `${VEHICLE_TYPE_SERVICE_BASE}/public/categories/${categoryId}/vehicle-types`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      }
    );
    
    return handleResponse<VehicleType[]>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout - Could not fetch vehicle types');
    }
    throw error;
  }
}

/**
 * Fetch all vehicle types (optionally filtered by category slug)
 * 
 * @param categorySlug - Optional category slug to filter by (e.g., "transport", "luxury")
 */
export async function fetchVehicleTypes(categorySlug?: string): Promise<VehicleType[]> {
  const controller = createTimeoutController();
  
  try {
    let url = `${VEHICLE_TYPE_SERVICE_BASE}/public/vehicle-types`;
    if (categorySlug) {
      url += `?category_slug=${encodeURIComponent(categorySlug)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    return handleResponse<VehicleType[]>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout - Could not fetch vehicle types');
    }
    throw error;
  }
}

/**
 * Send OTP to email
 */
export async function sendOTP(request: OTPSendRequest): Promise<OTPSendResponse> {
  const controller = createTimeoutController();
  
  try {
    const response = await fetch(`${AUTH_SERVICE_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: request.email.toLowerCase().trim(),
        purpose: request.purpose,
        user_type: request.user_type || 'client',
        phone: request.phone,
        phone_number: request.phone_number,
        country_code: request.country_code,
        full_name: request.full_name,
      }),
      signal: controller.signal,
    });
    
    return handleResponse<OTPSendResponse>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout');
    }
    throw error;
  }
}

/**
 * Verify OTP and get registration token
 */
export async function verifyOTP(request: OTPVerifyRequest): Promise<OTPVerifyResponse> {
  const controller = createTimeoutController();
  
  try {
    const response = await fetch(`${AUTH_SERVICE_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: request.email.toLowerCase().trim(),
        otp: request.otp.trim(),
      }),
      signal: controller.signal,
    });
    
    return handleResponse<OTPVerifyResponse>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout');
    }
    throw error;
  }
}

/**
 * Register driver (main registration endpoint)
 */
export async function registerDriver(
  driverData: DriverRegistrationRequest,
  documents?: EncryptedDocument[]
): Promise<DriverRegistrationResponse> {
  const controller = createTimeoutController(60000); // 60s for file upload
  
  try {
    // Build form data for multipart request
    const formData = new FormData();
    
    // Add driver data as JSON
    formData.append('driver_data', JSON.stringify({
      email: driverData.email.toLowerCase().trim(),
      password: driverData.password,
      full_name: driverData.full_name.trim(),
      phone_number: driverData.phone_number.trim(),
      registration_token: driverData.registration_token,
      vehicle_type_id: driverData.vehicle_type_id,
      license_plate: driverData.license_plate?.toUpperCase().trim(),
    }));
    
    // Add encrypted documents
    if (documents && documents.length > 0) {
      formData.append('encrypted_documents', JSON.stringify(documents));
    }
    
    const response = await fetch(`${DRIVER_SERVICE_BASE}/drivers/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
      signal: controller.signal,
    });
    
    return handleResponse<DriverRegistrationResponse>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout - please try again');
    }
    throw error;
  }
}

/**
 * Alternative: Register driver with JSON body (for backends expecting JSON)
 */
export async function registerDriverJSON(
  driverData: DriverRegistrationRequest,
  documents?: {
    driving_license?: string; // Base64 encoded
    vehicle_registration?: string;
    insurance_document?: string;
    work_patent?: string;
  }
): Promise<DriverRegistrationResponse> {
  const controller = createTimeoutController(60000);
  
  try {
    const response = await fetch(`${DRIVER_SERVICE_BASE}/drivers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        ...driverData,
        email: driverData.email.toLowerCase().trim(),
        full_name: driverData.full_name.trim(),
        phone_number: driverData.phone_number.trim(),
        license_plate: driverData.license_plate?.toUpperCase().trim(),
        documents,
      }),
      signal: controller.signal,
    });
    
    return handleResponse<DriverRegistrationResponse>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout - please try again');
    }
    throw error;
  }
}

/**
 * Check if email is available
 */
export async function checkEmailAvailability(email: string): Promise<{ available: boolean }> {
  const controller = createTimeoutController();
  
  try {
    const response = await fetch(`${AUTH_SERVICE_BASE}/auth/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
      signal: controller.signal,
    });
    
    return handleResponse<{ available: boolean }>(response);
  } catch (error) {
    // If endpoint doesn't exist, assume email is available (will be checked during registration)
    if (error instanceof ApiError && error.status === 404) {
      return { available: true };
    }
    throw error;
  }
}

/**
 * Resend OTP
 */
export async function resendOTP(email: string): Promise<OTPSendResponse> {
  return sendOTP({ email, purpose: 'verification' });
}

// Rate limiting helper (client-side)
const rateLimitMap = new Map<string, number>();

export function checkRateLimit(action: string, limitMs: number = 60000): boolean {
  const lastCall = rateLimitMap.get(action);
  const now = Date.now();
  
  if (lastCall && now - lastCall < limitMs) {
    return false; // Rate limited
  }
  
  rateLimitMap.set(action, now);
  return true;
}

export function getRateLimitRemaining(action: string, limitMs: number = 60000): number {
  const lastCall = rateLimitMap.get(action);
  if (!lastCall) return 0;
  
  const remaining = limitMs - (Date.now() - lastCall);
  return Math.max(0, Math.ceil(remaining / 1000));
}
