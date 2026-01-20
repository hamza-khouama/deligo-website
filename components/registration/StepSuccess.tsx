/**
 * Step 6: Success Confirmation
 * 
 * Displays registration success message.
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Mail, Phone } from 'lucide-react';

interface StepSuccessProps {
  email: string;
  onClose: () => void;
}

export function StepSuccess({ email, onClose }: StepSuccessProps) {
  return (
    <div className="text-center space-y-6 py-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Registration Submitted!
        </h3>
        <p className="text-gray-600">
          Thank you for registering as a Deligo driver.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-4 text-left">
        <h4 className="font-medium text-gray-900">What happens next?</h4>
        
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-[#10B981]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Document Review</p>
              <p className="text-xs text-gray-500">
                Our team will review your documents within 24-48 hours.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 bg-[#10B981]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="h-4 w-4 text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Email Confirmation</p>
              <p className="text-xs text-gray-500">
                You&apos;ll receive an email at <span className="font-medium">{email}</span> once approved.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 bg-[#10B981]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="h-4 w-4 text-[#10B981]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">App Access</p>
              <p className="text-xs text-gray-500">
                Download the Deligo Driver app and log in with your credentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Keep your phone nearby. We may call you to verify your information.
        </p>
      </div>

      <Button
        onClick={onClose}
        className="w-full bg-[#10B981] hover:bg-[#059669] text-white"
      >
        Done
      </Button>

      <div className="flex justify-center gap-4 pt-2">
        <a
          href="#"
          className="text-sm text-[#10B981] hover:underline"
        >
          Download Android App
        </a>
        <span className="text-gray-300">|</span>
        <a
          href="#"
          className="text-sm text-[#10B981] hover:underline"
        >
          Download iOS App
        </a>
      </div>
    </div>
  );
}
