"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_BASE, VEHICLE_TYPE_SERVICE_BASE } from "@/lib/config/api"

interface VehicleType {
  id: number
  key: string
  name: string
  description: string
  capacity: number
  base_rate: number
  size_category: string
  vehicle_image_url?: string
  map_icon_url?: string
  is_active: boolean
}

interface AgentRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AgentRegistrationModal({ isOpen, onClose }: AgentRegistrationModalProps) {
  const [plateType, setPlateType] = useState("TU")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(false)

  // Fetch vehicle types from backend when modal opens
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      if (!isOpen) return
      
      setLoadingVehicleTypes(true)
      try {
        console.log('Fetching vehicle types from vehicle-type-service...')
        const response = await fetch(`${VEHICLE_TYPE_SERVICE_BASE}/api/public/vehicle-types`, {
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch vehicle types: ${response.status}`)
        }

        const data = await response.json()
        console.log('Backend vehicle types:', data)
        
        // The API returns a direct array
        const vehicleTypesArray = Array.isArray(data) ? data : []
        setVehicleTypes(vehicleTypesArray.filter((vt: VehicleType) => vt.is_active))
      } catch (error) {
        console.error('Error fetching vehicle types:', error)
        // Fallback to hardcoded types if backend is unavailable
        setVehicleTypes([
          {
            id: 1,
            key: "compact_van",
            name: "Compact Van",
            description: "Fiat Fiorino / Peugeot Bipper",
            capacity: 2,
            base_rate: 15.0,
            size_category: "small",
            vehicle_image_url: "../vehicles/compact-van.png",
            is_active: true
          },
          {
            id: 2,
            key: "pickup_truck", 
            name: "Pickup Truck",
            description: "Isuzu D-Max / Toyota Hilux / Peugeot Landtrek",
            capacity: 3,
            base_rate: 25.0,
            size_category: "medium",
            vehicle_image_url: "../vehicles/pickup-truck.png",
            is_active: true
          },
          {
            id: 3,
            key: "urban_delivery",
            name: "Urban Delivery Van", 
            description: "Volkswagen Caddy / Renault Kangoo",
            capacity: 2,
            base_rate: 20.0,
            size_category: "medium",
            vehicle_image_url: "../vehicles/urban-delivery.png",
            is_active: true
          },
          {
            id: 4,
            key: "mid_utility",
            name: "Mid Utility Van",
            description: "Peugeot Expert / Renault Trafic", 
            capacity: 3,
            base_rate: 30.0,
            size_category: "medium",
            vehicle_image_url: "../vehicles/mid-utility.png",
            is_active: true
          },
          {
            id: 5,
            key: "large_panel",
            name: "Large Panel Van",
            description: "Renault Master / Fiat Ducato",
            capacity: 4,
            base_rate: 40.0,
            size_category: "large", 
            vehicle_image_url: "../vehicles/large-panel.png",
            is_active: true
          },
          {
            id: 6,
            key: "commercial_body",
            name: "Commercial Body",
            description: "Peugeot Boxer Double Cab Flatbed",
            capacity: 2,
            base_rate: 60.0,
            size_category: "extra_large",
            vehicle_image_url: "../vehicles/commercial-body.png",
            is_active: true
          }
        ])
      } finally {
        setLoadingVehicleTypes(false)
      }
    }

    fetchVehicleTypes()
  }, [isOpen])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      
      // Get form values
      const fullName = formData.get('fullName') as string
      const phone = formData.get('phone') as string
      const email = formData.get('email') as string
      const vehicleType = formData.get('vehicleType') as string
      
      // Get license plate values
      let licensePlate = ''
      if (plateType === 'TU') {
        const part1 = formData.get('plateNumber1') as string
        const part2 = formData.get('plateNumber2') as string
        licensePlate = `${part1}TU${part2}`
      } else {
        const plateNumber = formData.get('plateNumber') as string
        licensePlate = `${plateNumber}RS`
      }

      // Get uploaded files and convert to base64
      const documentNames = ['drivingLicense', 'vehicleRegistration', 'insuranceDocument']
      const documents = await Promise.all(
        documentNames.map(async (name) => {
          const file = formData.get(name) as File
          if (!file || file.size === 0) {
            throw new Error(`Please upload ${name.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
          }
          
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
        })
      )

      // Handle optional work patent document
      let workPatentDocument = null
      const workPatentFile = formData.get('workPatent') as File
      console.log('Work patent file:', workPatentFile, 'Size:', workPatentFile?.size)
      if (workPatentFile && workPatentFile.size > 0) {
        console.log('Processing work patent document...')
        workPatentDocument = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => {
            console.log('Work patent converted to base64, length:', (reader.result as string).length)
            resolve(reader.result as string)
          }
          reader.readAsDataURL(workPatentFile)
        })
      } else {
        console.log('No work patent document provided')
      }

      // Prepare registration data
      const registrationData = {
        full_name: fullName,
        phone_number: phone,
        email: email,
        vehicle_type: vehicleType,
        license_plate_format: plateType,
        license_plate: licensePlate,
        driving_license: documents[0],
        vehicle_registration: documents[1],
        insurance_document: documents[2],
        work_patent: workPatentDocument
      }

      console.log('Registration data:', {
        ...registrationData,
        // Truncate base64 strings for readability
        driving_license: registrationData.driving_license ? `${registrationData.driving_license.substring(0, 50)}...` : null,
        vehicle_registration: registrationData.vehicle_registration ? `${registrationData.vehicle_registration.substring(0, 50)}...` : null,
        insurance_document: registrationData.insurance_document ? `${registrationData.insurance_document.substring(0, 50)}...` : null,
        work_patent: registrationData.work_patent ? `${registrationData.work_patent.substring(0, 50)}...` : null,
      })

      // Submit to backend
      const response = await fetch(`${API_BASE}/drivers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Registration failed')
      }

      const result = await response.json()
      
      if (result.success) {
        alert("Application submitted successfully! You will be contacted once your application is reviewed.")
        onClose()
      } else {
        throw new Error(result.message || 'Registration failed')
      }

    } catch (error) {
      console.error('Registration error:', error)
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Agent Registration</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required placeholder="Enter your full name" />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="Enter 8-digit phone number" />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="Enter your email address" />
            </div>

            <div>
              <Label>Vehicle Type</Label>
              {loadingVehicleTypes ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading vehicle types...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {vehicleTypes.map((vehicle) => {
                    // Use the Azure blob URL directly (no need to prefix with API_ORIGIN)
                    const imageUrl = vehicle.vehicle_image_url || "/placeholder.svg";
                    
                    return (
                      <label
                        key={vehicle.id}
                        className={`relative border rounded-lg p-4 cursor-pointer hover:border-primary transition-all duration-300 group hover:shadow-[0_0_15px_rgba(52,209,134,0.15)] hover:scale-105 ${
                          selectedVehicle === vehicle.key ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="vehicleType"
                          value={vehicle.key}
                          className="absolute opacity-0"
                          onChange={(e) => setSelectedVehicle(e.target.value)}
                          required
                        />
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                            <img
                              src={imageUrl}
                              alt={vehicle.name}
                              className="w-full h-full object-contain transition-transform duration-300 group-hover:-translate-y-1"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                (e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          </div>
                          <div className="font-medium text-sm">{vehicle.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{vehicle.description}</div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            <div>
              <Label>License Plate</Label>
              <div className="space-y-3 mt-2">
                <select
                  value={plateType}
                  onChange={(e) => setPlateType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="TU">TU Format</option>
                  <option value="RS">RS Format</option>
                </select>

                {plateType === "TU" ? (
                  <div className="flex gap-2 items-center">
                    <Input name="plateNumber1" className="w-24 text-center" placeholder="250" maxLength={3} />
                    <span className="text-gray-500">TU</span>
                    <Input name="plateNumber2" className="w-28 text-center" placeholder="3425" maxLength={4} />
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <Input name="plateNumber" className="w-32 text-center" placeholder="234567" maxLength={6} />
                    <span className="text-gray-500">RS</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Upload Documents</Label>
              <div className="space-y-3 mt-2">
                {[
                  { name: "drivingLicense", label: "Driving License", required: true },
                  { name: "vehicleRegistration", label: "Vehicle Registration", required: true },
                  { name: "insuranceDocument", label: "Insurance Document", required: true },
                  { name: "workPatent", label: "Work Patent Document (Optional)", required: false }
                ].map((doc) => (
                  <div key={doc.name} className="border border-dashed border-gray-300 rounded p-4">
                    <input
                      type="file"
                      name={doc.name}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      required={doc.required}
                    />
                    <p className="mt-1 text-xs text-gray-500">Upload {doc.label} (PDF, JPG, PNG)</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
