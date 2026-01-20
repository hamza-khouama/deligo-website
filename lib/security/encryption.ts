/**
 * Document Encryption Module
 * 
 * SECURITY COMPLIANCE:
 * - NIST SP 800-38D (GCM Mode)
 * - OWASP Cryptographic Guidelines
 * - ISO 27001 A.10 Cryptography
 * - GDPR Article 32 (Encryption at rest)
 * 
 * Uses AES-256-GCM for authenticated encryption of sensitive documents.
 */

// Encryption configuration
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM (NIST recommended)
const TAG_LENGTH = 128; // Authentication tag length

/**
 * Generate a random encryption key (for client-side encryption)
 * The key should be securely transmitted to the server
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable for transmission
    ['encrypt', 'decrypt']
  );
}

/**
 * Export key to base64 for transmission
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

/**
 * Import key from base64
 */
export async function importKey(keyBase64: string): Promise<CryptoKey> {
  const keyBuffer = base64ToArrayBuffer(keyBase64);
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-256-GCM
 * Returns base64 encoded: IV + Ciphertext + Auth Tag
 */
export async function encryptData(
  data: ArrayBuffer | Uint8Array,
  key: CryptoKey
): Promise<string> {
  // Generate random IV (NIST: 96 bits for GCM)
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  // Normalize to ArrayBuffer
  let dataBuffer: ArrayBuffer;
  if (data instanceof Uint8Array) {
    // Create a new ArrayBuffer from the Uint8Array
    dataBuffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(dataBuffer).set(data);
  } else {
    dataBuffer = data;
  }
  
  // Encrypt with authentication
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv: iv,
      tagLength: TAG_LENGTH,
    },
    key,
    dataBuffer
  );
  
  // Combine: IV + Ciphertext (includes auth tag)
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  // Convert to base64
  const resultBuffer = new ArrayBuffer(combined.byteLength);
  new Uint8Array(resultBuffer).set(combined);
  return arrayBufferToBase64(resultBuffer);
}

/**
 * Encrypt a file and return encrypted base64
 */
export async function encryptFile(
  file: File,
  key: CryptoKey
): Promise<{ encrypted: string; originalName: string; mimeType: string; size: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const encrypted = await encryptData(arrayBuffer, key);
  
  return {
    encrypted,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

/**
 * Encrypt base64 data (for already processed images)
 */
export async function encryptBase64(
  base64Data: string,
  key: CryptoKey
): Promise<string> {
  // Remove data URL prefix if present
  const base64Content = base64Data.includes(',') 
    ? base64Data.split(',')[1] 
    : base64Data;
  
  const binaryData = base64ToArrayBuffer(base64Content);
  return await encryptData(binaryData, key);
}

/**
 * Derive a key from a password (PBKDF2)
 * Used for server-side key derivation verification
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number = 100000 // OWASP recommended minimum
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Create a proper ArrayBuffer from the salt
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

// Utility functions
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Generate a secure random string for session IDs, etc.
 */
export function generateSecureId(length: number = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash sensitive data (SHA-256) for integrity verification
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return arrayBufferToBase64(hashBuffer);
}
