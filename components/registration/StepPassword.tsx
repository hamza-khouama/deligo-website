/**
 * Step 3: Password Creation
 * 
 * Secure password creation with strength indicator.
 * NIST SP 800-63B compliant.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Loader2, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Check, 
  X,
  ShieldCheck 
} from 'lucide-react';
import { validatePassword, validatePasswordMatch, PasswordStrength } from '@/lib/security/validation';

interface StepPasswordProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
}

export function StepPassword({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onNext,
  onBack,
  isLoading,
  error,
}: StepPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [confirmError, setConfirmError] = useState<string[]>([]);

  const handlePasswordChange = (value: string) => {
    onPasswordChange(value);
    const result = validatePassword(value);
    setPasswordStrength(result.strength);
    
    // Also validate confirm if it has a value
    if (confirmPassword) {
      const matchResult = validatePasswordMatch(value, confirmPassword);
      setConfirmError(matchResult.errors);
    }
  };

  const handleConfirmChange = (value: string) => {
    onConfirmPasswordChange(value);
    if (touched.confirm) {
      const result = validatePasswordMatch(password, value);
      setConfirmError(result.errors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordResult = validatePassword(password);
    const matchResult = validatePasswordMatch(password, confirmPassword);
    
    setTouched({ password: true, confirm: true });
    setPasswordStrength(passwordResult.strength);
    setConfirmError(matchResult.errors);
    
    if (passwordResult.isValid && matchResult.isValid) {
      onNext();
    }
  };

  const getStrengthColor = (level: PasswordStrength['level']) => {
    switch (level) {
      case 'weak': return 'bg-red-500';
      case 'fair': return 'bg-orange-500';
      case 'good': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      case 'very_strong': return 'bg-emerald-600';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthProgress = (score: number) => (score / 4) * 100;

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-green-600' : 'text-gray-500'}`}>
      {met ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3 text-gray-400" />
      )}
      {text}
    </div>
  );

  const isFormValid = password.length >= 8 && 
    passwordStrength && 
    passwordStrength.score >= 3 && 
    password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="h-8 w-8 text-[#10B981]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Create your password
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose a strong password to secure your account
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-500" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              className="pr-10"
              disabled={isLoading}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>

          {/* Password Strength Indicator */}
          {password.length > 0 && passwordStrength && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Password strength</span>
                <span className={`text-xs font-medium capitalize ${
                  passwordStrength.level === 'weak' ? 'text-red-500' :
                  passwordStrength.level === 'fair' ? 'text-orange-500' :
                  passwordStrength.level === 'good' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.level.replace('_', ' ')}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength.level)}`}
                  style={{ width: `${getStrengthProgress(passwordStrength.score)}%` }}
                />
              </div>
              
              {/* Requirements Checklist */}
              <div className="grid grid-cols-2 gap-1 mt-2">
                <RequirementItem 
                  met={passwordStrength.requirements.minLength} 
                  text="At least 8 characters" 
                />
                <RequirementItem 
                  met={passwordStrength.requirements.hasUppercase} 
                  text="Uppercase letter" 
                />
                <RequirementItem 
                  met={passwordStrength.requirements.hasLowercase} 
                  text="Lowercase letter" 
                />
                <RequirementItem 
                  met={passwordStrength.requirements.hasNumber} 
                  text="Number" 
                />
                <RequirementItem 
                  met={passwordStrength.requirements.hasSpecial} 
                  text="Special character" 
                />
                <RequirementItem 
                  met={passwordStrength.requirements.noCommonPatterns} 
                  text="Not common" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-500" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => handleConfirmChange(e.target.value)}
              onBlur={() => {
                setTouched(prev => ({ ...prev, confirm: true }));
                const result = validatePasswordMatch(password, confirmPassword);
                setConfirmError(result.errors);
              }}
              className={`pr-10 ${confirmError.length > 0 && touched.confirm ? 'border-red-500' : ''}`}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
          {touched.confirm && confirmError.length > 0 && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {confirmError[0]}
            </p>
          )}
          {touched.confirm && confirmPassword && confirmError.length === 0 && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Passwords match
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Continue'
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-gray-500 hover:text-gray-700"
          onClick={onBack}
          disabled={isLoading}
        >
          ← Back
        </Button>
      </div>
    </form>
  );
}
