/**
 * Step 4: Vehicle & Phone Information
 * 
 * Collects vehicle type, license plate, and phone number.
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Loader2, 
  Car, 
  Phone, 
  AlertCircle, 
  Bike,
  Truck
} from 'lucide-react';
import { validatePhone, validateLicensePlate } from '@/lib/security/validation';
import Image from 'next/image';

export interface VehicleType {
  id: string | number;
  name: string;
  description?: string;
  vehicle_image_url?: string;
  map_icon_url?: string;
}

interface StepVehicleInfoProps {
  phone: string;
  vehicleType: string;
  licensePlate: string;
  plateFormat: 'TU' | 'RS';
  vehicleTypes: VehicleType[];
  onPhoneChange: (phone: string) => void;
  onVehicleTypeChange: (type: string) => void;
  onLicensePlateChange: (plate: string) => void;
  onPlateFormatChange: (format: 'TU' | 'RS') => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
}

export function StepVehicleInfo({
  phone,
  vehicleType,
  licensePlate,
  plateFormat,
  vehicleTypes,
  onPhoneChange,
  onVehicleTypeChange,
  onLicensePlateChange,
  onPlateFormatChange,
  onNext,
  onBack,
  isLoading,
  error,
}: StepVehicleInfoProps) {
  const [fieldErrors, setFieldErrors] = useState<{
    phone?: string[];
    vehicleType?: string[];
    licensePlate?: string[];
  }>({});
  const [touched, setTouched] = useState<{
    phone: boolean;
    vehicleType: boolean;
    licensePlate: boolean;
  }>({ phone: false, vehicleType: false, licensePlate: false });

  const getVehicleIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('moto') || lowerName.includes('bike')) {
      return <Bike className="h-5 w-5" />;
    }
    if (lowerName.includes('truck') || lowerName.includes('camion')) {
      return <Truck className="h-5 w-5" />;
    }
    return <Car className="h-5 w-5" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneResult = validatePhone(phone);
    const plateResult = validateLicensePlate(licensePlate, plateFormat);
    
    const errors: typeof fieldErrors = {};
    if (!phoneResult.isValid) errors.phone = phoneResult.errors;
    if (!vehicleType) errors.vehicleType = ['Please select a vehicle type'];
    if (!plateResult.isValid) errors.licensePlate = plateResult.errors;
    
    setFieldErrors(errors);
    setTouched({ phone: true, vehicleType: true, licensePlate: true });
    
    if (Object.keys(errors).length === 0) {
      onNext();
    }
  };

  const isFormValid = 
    validatePhone(phone).isValid && 
    vehicleType && 
    validateLicensePlate(licensePlate, plateFormat).isValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Car className="h-8 w-8 text-[#10B981]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Vehicle Information
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Tell us about your vehicle
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-5">
        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+216 XX XXX XXX"
            value={phone}
            onChange={(e) => {
              onPhoneChange(e.target.value);
              if (touched.phone) {
                const result = validatePhone(e.target.value);
                setFieldErrors(prev => ({ ...prev, phone: result.errors }));
              }
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, phone: true }));
              const result = validatePhone(phone);
              setFieldErrors(prev => ({ ...prev, phone: result.errors }));
            }}
            className={fieldErrors.phone?.length ? 'border-red-500' : ''}
            disabled={isLoading}
            autoComplete="tel"
          />
          {touched.phone && fieldErrors.phone?.map((err, i) => (
            <p key={i} className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {err}
            </p>
          ))}
        </div>

        {/* Vehicle Type Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Car className="h-4 w-4 text-gray-500" />
            Vehicle Type
          </Label>
          
          {vehicleTypes.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading vehicle types...
            </div>
          ) : (
            <RadioGroup
              value={vehicleType}
              onValueChange={(value) => {
                onVehicleTypeChange(value);
                setTouched(prev => ({ ...prev, vehicleType: true }));
                setFieldErrors(prev => ({ ...prev, vehicleType: undefined }));
              }}
              className="grid grid-cols-2 gap-3"
            >
              {vehicleTypes.map((type) => {
                const selected = vehicleType === String(type.id)
                return (
                <div key={type.id} className="relative">
                  <Label
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${selected ? 'border-[#10B981] bg-[#10B981]/5' : 'hover:border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => {
                      onVehicleTypeChange(String(type.id))
                      setTouched(prev => ({ ...prev, vehicleType: true }))
                      setFieldErrors(prev => ({ ...prev, vehicleType: undefined }))
                    }}
                  >
                    <RadioGroupItem
                      value={String(type.id)}
                      className="sr-only"
                    />

                    {type.vehicle_image_url ? (
                      <div className="relative w-16 h-12 mb-2">
                        <Image
                          src={type.vehicle_image_url}
                          alt={type.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className={`text-gray-600 ${selected ? 'text-[#10B981]' : ''} mb-2`}>
                        {getVehicleIcon(type.name)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {type.name}
                    </span>
                    {type.description && (
                      <span className="text-xs text-gray-500 mt-1 text-center">
                        {type.description}
                      </span>
                    )}
                  </Label>
                </div>
              )})}
            </RadioGroup>
          )}
          
          {touched.vehicleType && fieldErrors.vehicleType?.map((err, i) => (
            <p key={i} className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {err}
            </p>
          ))}
        </div>

        {/* License Plate */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            License Plate
          </Label>
          
          {/* Plate Format Selection */}
          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              variant={plateFormat === 'TU' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPlateFormatChange('TU')}
              className={plateFormat === 'TU' ? 'bg-[#10B981] hover:bg-[#059669]' : ''}
            >
              TU Format
            </Button>
            <Button
              type="button"
              variant={plateFormat === 'RS' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPlateFormatChange('RS')}
              className={plateFormat === 'RS' ? 'bg-[#10B981] hover:bg-[#059669]' : ''}
            >
              RS Format
            </Button>
          </div>
          
          <Input
            id="licensePlate"
            type="text"
            placeholder={plateFormat === 'TU' ? '123TU4567' : '123456RS'}
            value={licensePlate}
            onChange={(e) => {
              onLicensePlateChange(e.target.value.toUpperCase());
              if (touched.licensePlate) {
                const result = validateLicensePlate(e.target.value, plateFormat);
                setFieldErrors(prev => ({ ...prev, licensePlate: result.errors }));
              }
            }}
            onBlur={() => {
              setTouched(prev => ({ ...prev, licensePlate: true }));
              const result = validateLicensePlate(licensePlate, plateFormat);
              setFieldErrors(prev => ({ ...prev, licensePlate: result.errors }));
            }}
            className={`uppercase ${fieldErrors.licensePlate?.length ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          {touched.licensePlate && fieldErrors.licensePlate?.map((err, i) => (
            <p key={i} className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {err}
            </p>
          ))}
          <p className="text-xs text-gray-400">
            {plateFormat === 'TU' 
              ? 'Format: 123TU4567 (numbers-TU-numbers)'
              : 'Format: 123456RS (numbers followed by RS)'}
          </p>
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
