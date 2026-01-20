/**
 * Document Watermark Module
 * 
 * SECURITY COMPLIANCE:
 * - ISO 27001 A.8 Asset Management (Document protection)
 * - GDPR Article 32 (Data integrity)
 * - Tamper-evident watermarking
 * 
 * Adds invisible and visible watermarks to sensitive documents
 * to prevent unauthorized use and enable audit trails.
 */

export interface WatermarkOptions {
  /** Unique registration session ID */
  sessionId: string;
  /** User email (will be partially masked) */
  email: string;
  /** Timestamp of document processing */
  timestamp: Date;
  /** Add visible watermark (in addition to invisible) */
  visibleWatermark?: boolean;
  /** Watermark text for visible watermark */
  watermarkText?: string;
  /** Opacity of visible watermark (0-1) */
  opacity?: number;
}

/** Simplified options for processDocument */
export interface ProcessDocumentOptions {
  userEmail: string;
  documentType: string;
  addVisibleWatermark?: boolean;
  addInvisibleWatermark?: boolean;
}

export interface WatermarkedDocument {
  /** Base64 encoded watermarked image */
  data: string;
  /** Original file name */
  originalName: string;
  /** MIME type */
  mimeType: string;
  /** Watermark metadata hash for verification */
  metadataHash: string;
  /** Timestamp */
  processedAt: string;
}

/** Result from processDocument function */
export interface ProcessedDocument {
  blob: Blob;
  originalName: string;
  mimeType: string;
  metadataHash?: string;
  watermarkId?: string;
  processedAt: string;
}

/**
 * Apply watermark to an image document
 * Supports JPEG and PNG formats
 */
export async function applyWatermark(
  file: File,
  options: WatermarkOptions
): Promise<WatermarkedDocument> {
  const { sessionId, email, timestamp, visibleWatermark = true, opacity = 0.15 } = options;
  
  // Validate file type
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    throw new Error('Watermarking only supports JPEG and PNG images');
  }
  
  // Create image from file
  const imageUrl = URL.createObjectURL(file);
  const image = await loadImage(imageUrl);
  URL.revokeObjectURL(imageUrl);
  
  // Create canvas for processing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }
  
  // Set canvas size to image size
  canvas.width = image.width;
  canvas.height = image.height;
  
  // Draw original image
  ctx.drawImage(image, 0, 0);
  
  // Create metadata for invisible watermark
  const metadata = {
    sessionId,
    emailHash: await hashEmail(email),
    timestamp: timestamp.toISOString(),
    purpose: 'driver_registration',
    platform: 'deligo_website',
  };
  
  // Apply invisible watermark (LSB steganography in a corner)
  applyInvisibleWatermark(ctx, metadata, canvas.width, canvas.height);
  
  // Apply visible watermark if requested
  if (visibleWatermark) {
    const watermarkText = options.watermarkText || 
      `DÉLIGO - ${maskEmail(email)} - ${formatDate(timestamp)}`;
    applyVisibleWatermark(ctx, watermarkText, canvas.width, canvas.height, opacity);
  }
  
  // Convert to base64
  const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const quality = mimeType === 'image/jpeg' ? 0.92 : undefined;
  const dataUrl = canvas.toDataURL(mimeType, quality);
  
  // Generate metadata hash for integrity verification
  const metadataHash = await generateMetadataHash(metadata);
  
  return {
    data: dataUrl,
    originalName: file.name,
    mimeType,
    metadataHash,
    processedAt: timestamp.toISOString(),
  };
}

/**
 * Apply watermark to PDF documents
 * Returns a placeholder - actual PDF watermarking should be done server-side
 */
export async function applyPdfWatermark(
  file: File,
  options: WatermarkOptions
): Promise<{ data: string; requiresServerProcessing: boolean; metadata: object }> {
  // For PDFs, we'll mark them for server-side watermarking
  // Client-side PDF manipulation is limited and can be easily bypassed
  
  const arrayBuffer = await file.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);
  
  const metadata = {
    sessionId: options.sessionId,
    emailHash: await hashEmail(options.email),
    timestamp: options.timestamp.toISOString(),
    purpose: 'driver_registration',
    requiresServerWatermark: true,
  };
  
  return {
    data: `data:application/pdf;base64,${base64}`,
    requiresServerProcessing: true,
    metadata,
  };
}

/**
 * Process any document type (routes to appropriate handler)
 * This is the main entry point for document processing.
 */
export async function processDocument(
  file: File,
  options: ProcessDocumentOptions
): Promise<ProcessedDocument> {
  const timestamp = new Date();
  const sessionId = crypto.randomUUID();
  
  const watermarkOptions: WatermarkOptions = {
    sessionId,
    email: options.userEmail,
    timestamp,
    visibleWatermark: options.addVisibleWatermark ?? true,
  };

  if (file.type === 'application/pdf') {
    const result = await applyPdfWatermark(file, watermarkOptions);
    // Convert data URL to Blob
    const blob = dataUrlToBlob(result.data);
    return {
      blob,
      originalName: file.name,
      mimeType: file.type,
      watermarkId: sessionId,
      processedAt: timestamp.toISOString(),
    };
  }
  
  if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    const result = await applyWatermark(file, watermarkOptions);
    // Convert data URL to Blob
    const blob = dataUrlToBlob(result.data);
    return {
      blob,
      originalName: result.originalName,
      mimeType: result.mimeType,
      metadataHash: result.metadataHash,
      watermarkId: sessionId,
      processedAt: result.processedAt,
    };
  }
  
  throw new Error(`Unsupported file type: ${file.type}`);
}

/**
 * Process document using full WatermarkOptions (legacy)
 */
export async function processDocumentFull(
  file: File,
  options: WatermarkOptions
): Promise<WatermarkedDocument | { data: string; requiresServerProcessing: boolean; metadata: object }> {
  if (file.type === 'application/pdf') {
    return applyPdfWatermark(file, options);
  }
  
  if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    return applyWatermark(file, options);
  }
  
  throw new Error(`Unsupported file type: ${file.type}`);
}

/** Convert data URL to Blob */
function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Helper functions

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function applyVisibleWatermark(
  ctx: CanvasRenderingContext2D,
  text: string,
  width: number,
  height: number,
  opacity: number
): void {
  ctx.save();
  
  // Calculate font size based on image dimensions
  const fontSize = Math.max(12, Math.min(width, height) * 0.03);
  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = `rgba(128, 128, 128, ${opacity})`;
  
  // Rotate and tile watermark across image
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 6); // -30 degrees
  
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize * 1.5;
  
  // Calculate grid for tiling
  const diagonal = Math.sqrt(width * width + height * height);
  const cols = Math.ceil(diagonal / (textWidth + 50));
  const rows = Math.ceil(diagonal / (textHeight + 30));
  
  // Draw tiled watermark
  for (let row = -rows; row <= rows; row++) {
    for (let col = -cols; col <= cols; col++) {
      const x = col * (textWidth + 50);
      const y = row * (textHeight + 30);
      ctx.fillText(text, x, y);
    }
  }
  
  ctx.restore();
  
  // Add corner watermark (more visible)
  ctx.save();
  ctx.font = `bold ${fontSize * 0.8}px Arial, sans-serif`;
  ctx.fillStyle = `rgba(100, 100, 100, ${opacity * 1.5})`;
  
  // Bottom right corner
  const padding = 10;
  const cornerText = `© DÉLIGO ${new Date().getFullYear()}`;
  const cornerMetrics = ctx.measureText(cornerText);
  ctx.fillText(cornerText, width - cornerMetrics.width - padding, height - padding);
  
  ctx.restore();
}

function applyInvisibleWatermark(
  ctx: CanvasRenderingContext2D,
  metadata: object,
  width: number,
  height: number
): void {
  // Simple LSB watermarking in a small region
  // This embeds metadata in the least significant bits of pixel values
  // More robust methods would use DCT or DWT domain
  
  const metadataStr = JSON.stringify(metadata);
  const binary = textToBinary(metadataStr);
  
  // Get pixel data from a corner region (less likely to be cropped)
  const regionSize = Math.min(100, Math.floor(width * 0.1), Math.floor(height * 0.1));
  const imageData = ctx.getImageData(width - regionSize, height - regionSize, regionSize, regionSize);
  const data = imageData.data;
  
  // Embed binary data in LSB of blue channel
  let bitIndex = 0;
  for (let i = 0; i < data.length && bitIndex < binary.length; i += 4) {
    if (bitIndex < binary.length) {
      // Modify blue channel LSB
      const bit = parseInt(binary[bitIndex], 10);
      data[i + 2] = (data[i + 2] & 0xFE) | bit;
      bitIndex++;
    }
  }
  
  // Write back modified pixels
  ctx.putImageData(imageData, width - regionSize, height - regionSize);
}

async function hashEmail(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(email.toLowerCase()));
  return arrayBufferToHex(hashBuffer).substring(0, 16);
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  
  const maskedLocal = local.length > 2 
    ? `${local[0]}${'*'.repeat(Math.min(local.length - 2, 4))}${local[local.length - 1]}`
    : '**';
  
  const domainParts = domain.split('.');
  const maskedDomain = domainParts.length > 1
    ? `${domainParts[0][0]}***${domainParts.slice(-1)[0]}`
    : domain;
  
  return `${maskedLocal}@${maskedDomain}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

async function generateMetadataHash(metadata: object): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(JSON.stringify(metadata))
  );
  return arrayBufferToHex(hashBuffer);
}

function textToBinary(text: string): string {
  return text.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
