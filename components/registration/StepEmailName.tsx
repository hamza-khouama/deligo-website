/**
 * Step 1: Email & Name Entry
 * 
 * First step in the driver registration flow.
 * Collects email (for OTP) and full name.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, User, AlertCircle, Info } from 'lucide-react';
import { validateEmail, validateFullName } from '@/lib/security/validation';

interface StepEmailNameProps {
  email: string;
  fullName: string;
  onEmailChange: (email: string) => void;
  onFullNameChange: (name: string) => void;
  onNext: () => void;
  isLoading: boolean;
  error?: string;
}

export function StepEmailName({
  email,
  fullName,
  onEmailChange,
  onFullNameChange,
  onNext,
  isLoading,
  error,
}: StepEmailNameProps) {
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string[];
    fullName?: string[];
  }>({});
  const [touched, setTouched] = useState<{
    email: boolean;
    fullName: boolean;
  }>({ email: false, fullName: false });

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    const result = validateEmail(email);
    setFieldErrors(prev => ({ ...prev, email: result.errors }));
  };

  const handleFullNameBlur = () => {
    setTouched(prev => ({ ...prev, fullName: true }));
    const result = validateFullName(fullName);
    setFieldErrors(prev => ({ ...prev, fullName: result.errors }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = validateEmail(email);
    const nameResult = validateFullName(fullName);
    
    setFieldErrors({
      email: emailResult.errors,
      fullName: nameResult.errors,
    });
    setTouched({ email: true, fullName: true });
    
    if (emailResult.isValid && nameResult.isValid) {
      onNext();
    }
  };

  const isValid = validateEmail(email).isValid && validateFullName(fullName).isValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Let&apos;s get started
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Enter your details to begin the registration process
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => {
              onFullNameChange(e.target.value);
              if (touched.fullName) {
                const result = validateFullName(e.target.value);
                setFieldErrors(prev => ({ ...prev, fullName: result.errors }));
              }
            }}
            onBlur={handleFullNameBlur}
            className={fieldErrors.fullName?.length ? 'border-red-500' : ''}
            disabled={isLoading}
            autoComplete="name"
          />
          {touched.fullName && fieldErrors.fullName?.map((err, i) => (
            <p key={i} className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {err}
            </p>
          ))}
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Must match the name on your driving license and ID
          </p>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => {
              onEmailChange(e.target.value);
              if (touched.email) {
                const result = validateEmail(e.target.value);
                setFieldErrors(prev => ({ ...prev, email: result.errors }));
              }
            }}
            onBlur={handleEmailBlur}
            className={fieldErrors.email?.length ? 'border-red-500' : ''}
            disabled={isLoading}
            autoComplete="email"
          />
          {touched.email && fieldErrors.email?.map((err, i) => (
            <p key={i} className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {err}
            </p>
          ))}
          <p className="text-xs text-gray-400">
            We&apos;ll send a verification code to this email
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
        disabled={isLoading || !isValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending verification code...
          </>
        ) : (
          'Continue'
        )}
      </Button>

      <p className="text-xs text-center text-gray-400 mt-4">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-[#10B981] hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-[#10B981] hover:underline">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}
