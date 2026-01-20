/**
 * Step 2: OTP Verification
 * 
 * Verifies the email with OTP code.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot, 
  InputOTPSeparator 
} from '@/components/ui/input-otp';
import { Loader2, Mail, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { validateOTP } from '@/lib/security/validation';
import { getRateLimitRemaining } from '@/lib/services/driver-registration-api';

interface StepOTPVerificationProps {
  email: string;
  otp: string;
  onOTPChange: (otp: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  isLoading: boolean;
  isResending: boolean;
  error?: string;
  canResend: boolean;
}

export function StepOTPVerification({
  email,
  otp,
  onOTPChange,
  onVerify,
  onResend,
  onBack,
  isLoading,
  isResending,
  error,
  canResend,
}: StepOTPVerificationProps) {
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState<string[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (!canResend) {
      const remaining = getRateLimitRemaining('otp-send', 60000);
      setCountdown(remaining);
      
      const interval = setInterval(() => {
        const newRemaining = getRateLimitRemaining('otp-send', 60000);
        setCountdown(newRemaining);
        if (newRemaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [canResend]);

  const handleOTPComplete = (value: string) => {
    onOTPChange(value);
    const result = validateOTP(value);
    setOtpError(result.errors);
    
    // Auto-submit when OTP is complete and valid (5 digits)
    if (result.isValid && value.length === 5) {
      setTimeout(() => onVerify(), 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure OTP is exactly 5 digits before validating
    if (otp.length !== 5) {
      setOtpError(['Please enter all 5 digits']);
      return;
    }
    
    const result = validateOTP(otp);
    setOtpError(result.errors);
    
    if (result.isValid) {
      onVerify();
    }
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    if (local.length <= 3) {
      return `${local[0]}***@${domain}`;
    }
    return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-[#10B981]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Verify your email
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          We sent a 5-digit code to{' '}
          <span className="font-medium text-gray-700">{maskEmail(email)}</span>
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center space-y-4">
        <InputOTP
          maxLength={5}
          value={otp}
          onChange={handleOTPComplete}
          disabled={isLoading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
          </InputOTPGroup>
        </InputOTP>

        {otpError.length > 0 && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {otpError[0]}
          </p>
        )}

        {otp.length === 5 && otpError.length === 0 && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Code entered
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
          disabled={isLoading || otp.length < 5 || otpError.length > 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-500">Didn&apos;t receive the code?</span>
          {canResend && countdown <= 0 ? (
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-[#10B981] hover:text-[#059669]"
              onClick={onResend}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend code'
              )}
            </Button>
          ) : (
            <span className="text-gray-400">
              Resend in {countdown}s
            </span>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        className="w-full text-gray-500 hover:text-gray-700"
        onClick={onBack}
        disabled={isLoading}
      >
        ← Back to email
      </Button>

      <p className="text-xs text-center text-gray-400">
        The code expires in 15 minutes. Check your spam folder if you don&apos;t see it.
      </p>
    </form>
  );
}
