/**
 * Step 5: Document Upload
 * 
 * Secure document upload with watermarking and encryption.
 * GDPR Article 32 compliant.
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  FileText, 
  Upload, 
  AlertCircle, 
  Check,
  X,
  Shield,
  Info,
  Image as ImageIcon
} from 'lucide-react';
import { validateDocument } from '@/lib/security/validation';

export interface DocumentFile {
  file: File | null;
  preview?: string;
  isProcessed?: boolean;
  error?: string;
}

export interface Documents {
  drivingLicense: DocumentFile;
  vehicleRegistration: DocumentFile;
  insuranceDocument: DocumentFile;
  workPatent: DocumentFile;
}

interface StepDocumentUploadProps {
  documents: Documents;
  onDocumentChange: (docType: keyof Documents, file: File | null) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  isProcessing: boolean;
  processingProgress: number;
  error?: string;
  userEmail: string;
}

const DOCUMENT_CONFIG: Record<keyof Documents, { 
  label: string; 
  description: string; 
  required: boolean;
  icon: React.ReactNode;
}> = {
  drivingLicense: {
    label: 'Driving License',
    description: 'Front side of your valid driving license',
    required: true,
    icon: <FileText className="h-5 w-5" />,
  },
  vehicleRegistration: {
    label: 'Vehicle Registration Card',
    description: 'Official vehicle registration document (carte grise)',
    required: true,
    icon: <FileText className="h-5 w-5" />,
  },
  insuranceDocument: {
    label: 'Insurance Certificate',
    description: 'Valid vehicle insurance document',
    required: true,
    icon: <Shield className="h-5 w-5" />,
  },
  workPatent: {
    label: 'Work Patent (Patente)',
    description: 'Optional - Professional work permit if applicable',
    required: false,
    icon: <FileText className="h-5 w-5" />,
  },
};

export function StepDocumentUpload({
  documents,
  onDocumentChange,
  onNext,
  onBack,
  isLoading,
  isProcessing,
  processingProgress,
  error,
  userEmail,
}: StepDocumentUploadProps) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleFileSelect = useCallback((docType: keyof Documents, file: File | null) => {
    if (!file) {
      onDocumentChange(docType, null);
      return;
    }

    const config = DOCUMENT_CONFIG[docType];
    const result = validateDocument(file, { 
      required: config.required,
      maxSizeMB: 10,
      allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    });

    if (!result.isValid) {
      setFieldErrors(prev => ({ ...prev, [docType]: result.errors }));
      return;
    }

    setFieldErrors(prev => ({ ...prev, [docType]: [] }));
    onDocumentChange(docType, file);
  }, [onDocumentChange]);

  const handleDragOver = (e: React.DragEvent, docType: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(docType);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, docType: keyof Documents) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(docType, files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all required documents
    const errors: Record<string, string[]> = {};
    let hasErrors = false;

    (Object.keys(DOCUMENT_CONFIG) as Array<keyof Documents>).forEach((docType) => {
      const config = DOCUMENT_CONFIG[docType];
      const doc = documents[docType];
      
      if (config.required && !doc.file) {
        errors[docType] = [`${config.label} is required`];
        hasErrors = true;
      }
    });

    setFieldErrors(errors);

    if (!hasErrors) {
      onNext();
    }
  };

  const isFormValid = Object.entries(DOCUMENT_CONFIG)
    .filter(([, config]) => config.required)
    .every(([key]) => documents[key as keyof Documents].file !== null);

  const DocumentUploadCard = ({ docType }: { docType: keyof Documents }) => {
    const config = DOCUMENT_CONFIG[docType];
    const doc = documents[docType];
    const errors = fieldErrors[docType] || [];
    const isDraggedOver = dragOver === docType;

    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <span className="text-gray-500">{config.icon}</span>
          {config.label}
          {config.required && <span className="text-red-500">*</span>}
        </Label>

        <div
          onClick={() => fileInputRefs.current[docType]?.click()}
          onDragOver={(e) => handleDragOver(e, docType)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, docType)}
          className={`
            relative border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer
            ${isDraggedOver 
              ? 'border-[#10B981] bg-[#10B981]/5' 
              : doc.file 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
            ${errors.length > 0 ? 'border-red-500 bg-red-50' : ''}
          `}
        >
          <input
            ref={(el) => { fileInputRefs.current[docType] = el; }}
            type="file"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            className="sr-only"
            onChange={(e) => {
              const files = e.target.files;
              handleFileSelect(docType, files ? files[0] : null);
            }}
            disabled={isLoading || isProcessing}
          />

          {doc.file ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                {doc.file.type.startsWith('image/') ? (
                  <ImageIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <FileText className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex items-center gap-2">
                {doc.isProcessed && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileSelect(docType, null);
                  }}
                  disabled={isLoading || isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <Upload className={`h-8 w-8 mx-auto mb-2 ${isDraggedOver ? 'text-[#10B981]' : 'text-gray-400'}`} />
              <p className="text-sm text-gray-600">
                <span className="text-[#10B981] font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG or PDF (max 10MB)
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500">{config.description}</p>

        {errors.map((err, i) => (
          <p key={i} className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {err}
          </p>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-[#10B981]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Upload Documents
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Upload your required documents securely
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Security Notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          <strong>Security:</strong> Your documents will be watermarked with your email ({userEmail.slice(0, 3)}***) 
          and encrypted before transmission. This protects your documents from unauthorized use.
        </AlertDescription>
      </Alert>

      {/* Processing Progress */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Processing documents...</span>
            <span className="text-gray-500">{processingProgress}%</span>
          </div>
          <Progress value={processingProgress} className="h-2" />
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Applying watermarks and encryption...
          </p>
        </div>
      )}

      {/* Document Upload Cards */}
      <div className="space-y-4">
        {(Object.keys(DOCUMENT_CONFIG) as Array<keyof Documents>).map((docType) => (
          <DocumentUploadCard key={docType} docType={docType} />
        ))}
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium mb-1">Document Requirements:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Documents must be clear and readable</li>
            <li>All information must be visible</li>
            <li>Your name must match across all documents</li>
            <li>Documents must be valid and not expired</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
          disabled={isLoading || isProcessing || !isFormValid}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing documents...
            </>
          ) : isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Complete Registration'
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-gray-500 hover:text-gray-700"
          onClick={onBack}
          disabled={isLoading || isProcessing}
        >
          ← Back
        </Button>
      </div>
    </form>
  );
}
