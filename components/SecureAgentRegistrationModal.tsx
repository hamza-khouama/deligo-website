/**
 * Secure Agent Registration Modal
 * 
 * SECURITY COMPLIANCE:
 * - GDPR Article 32: Security of Processing
 * - NIST SP 800-63B: Digital Identity Guidelines
 * - OWASP Secure Coding Practices
 * - ASVS Level 2: Authentication
 * - ISO 27001 A.8, A.10: Access Control & Cryptography
 * 
 * Multi-step driver registration with:
 * - Email OTP verification
 * - Strong password creation
 * - Document watermarking
 * - Client-side encryption
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Step components
import {
  StepEmailName,
  StepOTPVerification,
  StepPassword,
  StepVehicleInfo,
  StepDocumentUpload,
  StepSuccess,
  type VehicleType,
  type Documents,
} from '@/components/registration';

// Services
import {
  fetchVehicleTypes,
  sendOTP,
  verifyOTP,
  registerDriverJSON,
  checkRateLimit,
  type APIError,
} from '@/lib/services/driver-registration-api';
import { getErrorMessage } from '@/lib/utils';

// Security utilities
import { processDocument, ProcessedDocument } from '@/lib/security/watermark';

interface SecureAgentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Registration steps
type RegistrationStep = 
  | 'email-name'
  | 'otp-verification'
  | 'password'
  | 'vehicle-info'
  | 'documents'
  | 'success';

const STEP_ORDER: RegistrationStep[] = [
  'email-name',
  'otp-verification',
  'password',
  'vehicle-info',
  'documents',
  'success',
];

const STEP_LABELS: Record<RegistrationStep, string> = {
  'email-name': 'Your Details',
  'otp-verification': 'Verify Email',
  'password': 'Create Password',
  'vehicle-info': 'Vehicle Info',
  'documents': 'Upload Documents',
  'success': 'Complete',
};

export function SecureAgentRegistrationModal({
  isOpen,
  onClose,
}: SecureAgentRegistrationModalProps) {
  // Current step
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('email-name');
  
  // Form data
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [plateFormat, setPlateFormat] = useState<'TU' | 'RS'>('TU');
  const [documents, setDocuments] = useState<Documents>({
    drivingLicense: { file: null },
    vehicleRegistration: { file: null },
    insuranceDocument: { file: null },
    workPatent: { file: null },
  });
  
  // Tokens
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isProcessingDocs, setIsProcessingDocs] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [canResendOtp, setCanResendOtp] = useState(false);
  
  // Data
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  // Fetch vehicle types on mount
  useEffect(() => {
    if (isOpen) {
      fetchVehicleTypes()
        .then(setVehicleTypes)
        .catch(console.error);
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset after animation completes
      const timeout = setTimeout(() => {
        setCurrentStep('email-name');
        setEmail('');
        setFullName('');
        setOtp('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setVehicleType('');
        setLicensePlate('');
        setPlateFormat('TU');
        setDocuments({
          drivingLicense: { file: null },
          vehicleRegistration: { file: null },
          insuranceDocument: { file: null },
          workPatent: { file: null },
        });
        setRegistrationToken(null);
        setError(undefined);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Calculate progress
  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const progress = ((currentStepIndex) / (STEP_ORDER.length - 1)) * 100;

  // Navigation
  const goToNextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
      setError(undefined);
    }
  }, [currentStepIndex]);

  const goToPreviousStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex]);
      setError(undefined);
    }
  }, [currentStepIndex]);

  // Handle document change
  const handleDocumentChange = useCallback((docType: keyof Documents, file: File | null) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: { file, isProcessed: false },
    }));
  }, []);

  // Step handlers
  const handleEmailNameNext = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Check rate limit
      if (!checkRateLimit('otp-send', 60000)) {
        setError('Please wait before requesting another verification code');
        return;
      }

      // Send OTP for driver registration
      await sendOTP({ 
        email, 
        purpose: 'verification',
        user_type: 'driver',
        full_name: fullName,
        phone: phone,
      });
      setCanResendOtp(false);
      
      // Wait before allowing resend
      setTimeout(() => setCanResendOtp(true), 60000);
      
      goToNextStep();
    } catch (err) {
      const apiError = err as APIError;
      setError(getErrorMessage(apiError) || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await verifyOTP({ email, otp });
      
      if (response.registration_token) {
        setRegistrationToken(response.registration_token);
        goToNextStep();
      } else {
        setError('Verification successful but no token received. Please try again.');
      }
    } catch (err) {
      const apiError = err as APIError;
      setError(getErrorMessage(apiError) || 'Invalid or expired verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPResend = async () => {
    setIsResending(true);
    setError(undefined);

    try {
      if (!checkRateLimit('otp-send', 60000)) {
        setError('Please wait before requesting another verification code');
        return;
      }

      await sendOTP({ email, purpose: 'verification' });
      setOtp('');
      setCanResendOtp(false);
      setTimeout(() => setCanResendOtp(true), 60000);
    } catch (err) {
      const apiError = err as APIError;
      setError(getErrorMessage(apiError) || 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  const handlePasswordNext = () => {
    goToNextStep();
  };

  const handleVehicleInfoNext = () => {
    goToNextStep();
  };

  const handleDocumentsSubmit = async () => {
    if (!registrationToken) {
      setError('Session expired. Please start again.');
      setCurrentStep('email-name');
      return;
    }

    setIsProcessingDocs(true);
    setProcessingProgress(0);
    setError(undefined);

    try {
      // Process documents (watermark)
      const processedDocs: Record<string, string> = {};
      const docEntries = Object.entries(documents).filter(([, doc]) => doc.file);
      const totalDocs = docEntries.length;
      let processed = 0;

      for (const [docType, doc] of docEntries) {
        if (doc.file) {
          try {
            const processed_doc: ProcessedDocument = await processDocument(doc.file, {
              userEmail: email,
              documentType: docType,
              addVisibleWatermark: true,
              addInvisibleWatermark: true,
            });

            // Convert to base64
            const reader = new FileReader();
            const base64 = await new Promise<string>((resolve, reject) => {
              reader.onload = () => {
                const result = reader.result as string;
                // Remove data URL prefix
                const base64Data = result.split(',')[1];
                resolve(base64Data);
              };
              reader.onerror = reject;
              reader.readAsDataURL(processed_doc.blob);
            });

            // Map document type to API field name
            const apiFieldMap: Record<string, string> = {
              drivingLicense: 'driving_license',
              vehicleRegistration: 'vehicle_registration',
              insuranceDocument: 'insurance_document',
              workPatent: 'work_patent',
            };

            processedDocs[apiFieldMap[docType] || docType] = base64;
          } catch (docError) {
            console.error(`Error processing ${docType}:`, docError);
            // Use original file if processing fails
            const reader = new FileReader();
            const base64 = await new Promise<string>((resolve, reject) => {
              reader.onload = () => {
                const result = reader.result as string;
                const base64Data = result.split(',')[1];
                resolve(base64Data);
              };
              reader.onerror = reject;
              reader.readAsDataURL(doc.file!);
            });

            const apiFieldMap: Record<string, string> = {
              drivingLicense: 'driving_license',
              vehicleRegistration: 'vehicle_registration',
              insuranceDocument: 'insurance_document',
              workPatent: 'work_patent',
            };

            processedDocs[apiFieldMap[docType] || docType] = base64;
          }

          processed++;
          setProcessingProgress(Math.round((processed / totalDocs) * 70));
        }
      }

      setProcessingProgress(80);
      setIsProcessingDocs(false);
      setIsLoading(true);

      // Submit registration
      await registerDriverJSON(
        {
          email,
          password,
          full_name: fullName,
          phone_number: phone,
          registration_token: registrationToken,
          vehicle_type_id: vehicleType ? parseInt(vehicleType) : undefined,
          license_plate: licensePlate || undefined,
        },
        processedDocs
      );

      setProcessingProgress(100);
      goToNextStep();
    } catch (err) {
      const apiError = err as APIError;
      setError(getErrorMessage(apiError) || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
      setIsProcessingDocs(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'email-name':
        return (
          <StepEmailName
            email={email}
            fullName={fullName}
            onEmailChange={setEmail}
            onFullNameChange={setFullName}
            onNext={handleEmailNameNext}
            isLoading={isLoading}
            error={error}
          />
        );

      case 'otp-verification':
        return (
          <StepOTPVerification
            email={email}
            otp={otp}
            onOTPChange={setOtp}
            onVerify={handleOTPVerify}
            onResend={handleOTPResend}
            onBack={goToPreviousStep}
            isLoading={isLoading}
            isResending={isResending}
            error={error}
            canResend={canResendOtp}
          />
        );

      case 'password':
        return (
          <StepPassword
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onNext={handlePasswordNext}
            onBack={goToPreviousStep}
            isLoading={isLoading}
            error={error}
          />
        );

      case 'vehicle-info':
        return (
          <StepVehicleInfo
            phone={phone}
            vehicleType={vehicleType}
            licensePlate={licensePlate}
            plateFormat={plateFormat}
            vehicleTypes={vehicleTypes}
            onPhoneChange={setPhone}
            onVehicleTypeChange={setVehicleType}
            onLicensePlateChange={setLicensePlate}
            onPlateFormatChange={setPlateFormat}
            onNext={handleVehicleInfoNext}
            onBack={goToPreviousStep}
            isLoading={isLoading}
            error={error}
          />
        );

      case 'documents':
        return (
          <StepDocumentUpload
            documents={documents}
            onDocumentChange={handleDocumentChange}
            onNext={handleDocumentsSubmit}
            onBack={goToPreviousStep}
            isLoading={isLoading}
            isProcessing={isProcessingDocs}
            processingProgress={processingProgress}
            error={error}
            userEmail={email}
          />
        );

      case 'success':
        return (
          <StepSuccess
            email={email}
            onClose={onClose}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {currentStep !== 'success' ? 'Become a Deligo Driver' : 'Registration Complete'}
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        {currentStep !== 'success' && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{STEP_LABELS[currentStep]}</span>
              <span>Step {currentStepIndex + 1} of {STEP_ORDER.length - 1}</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}

        {/* Step content */}
        <div className="py-2">
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SecureAgentRegistrationModal;
