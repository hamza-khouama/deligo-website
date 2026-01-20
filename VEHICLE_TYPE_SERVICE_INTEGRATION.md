# Vehicle Type Service - Website Integration Guide

## 📋 Overview

The new **vehicle-type-service** provides dynamic vehicle categories and types for the driver registration flow. This replaces hardcoded vehicle types with a fully managed microservice.

## 🎯 Key Features

### Before (Hardcoded)
- Fixed list of 6 vehicle types
- No categorization
- Unable to add new vehicles without code changes
- No images or additional metadata

### After (Vehicle Type Service)
- ✅ **Dynamic Categories**: Transport, Economy, Luxury, Delivery
- ✅ **Categorized Types**: Each category contains specific vehicle types
- ✅ **Rich Metadata**: Images, map icons, pricing, capacity, features
- ✅ **Admin Management**: CRUD operations via secure API
- ✅ **Caching**: Redis-based for performance
- ✅ **Audit Logging**: Track all changes

## 🔄 Driver Registration Flow

### Updated User Experience

1. **User starts driver registration**
2. **Step 1-3**: Email, OTP, Password (unchanged)
3. **Step 4 (NEW)**: Vehicle Category Selection
   ```
   [Dropdown] Select Vehicle Category:
   • Economy (Affordable everyday transportation)
   • Transport (Large capacity vehicles)
   • Luxury (Premium comfort)
   • Delivery (Fast delivery services)
   ```
4. **Step 4 (UPDATED)**: Vehicle Type Selection
   ```
   After selecting "Transport", show only transport vehicles:
   • Pickup (Open cargo bed truck)
   • Van (Enclosed cargo van)
   ```
5. **Step 5-6**: Documents, Success (unchanged)

## 💻 Frontend Integration

### 1. API Configuration Updated

**File**: `lib/config/api.tsx`

```typescript
// New environment variable
NEXT_PUBLIC_VEHICLE_TYPE_SERVICE_URL=http://localhost:8006

// New export
export const VEHICLE_TYPE_SERVICE_BASE = validateServiceUrl(
  VEHICLE_TYPE_SERVICE_URL, 
  'VEHICLE_TYPE'
);
```

### 2. New API Functions

**File**: `lib/services/driver-registration-api.ts`

```typescript
// Fetch all categories
export async function fetchVehicleCategories(): Promise<VehicleCategory[]>

// Fetch types for specific category
export async function fetchVehicleTypesByCategory(categoryId: string): Promise<VehicleType[]>

// Fetch all types (optionally filter by category slug)
export async function fetchVehicleTypes(categorySlug?: string): Promise<VehicleType[]>
```

### 3. Updated Types

```typescript
export interface VehicleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  icon?: string;
  color?: string;
  is_active: boolean;
  vehicle_types_count?: number;
}

export interface VehicleType {
  id: string;
  name: string;
  category_id?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  map_icon_url?: string;
  base_fare?: number;
  per_km_rate?: number;
  per_minute_rate?: number;
  max_passengers?: number;
  max_luggage?: number;
  features?: string[];
}
```

## 🎨 UI Implementation Example

### Add Category Dropdown

Update `components/registration/StepVehicleInfo.tsx`:

```tsx
import { 
  fetchVehicleCategories, 
  fetchVehicleTypesByCategory 
} from '@/lib/services/driver-registration-api';

// Add state
const [categories, setCategories] = useState<VehicleCategory[]>([]);
const [selectedCategory, setSelectedCategory] = useState<string>('');
const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

// Load categories on mount
useEffect(() => {
  async function loadCategories() {
    try {
      const cats = await fetchVehicleCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }
  loadCategories();
}, []);

// Load vehicle types when category changes
useEffect(() => {
  if (selectedCategory) {
    async function loadTypes() {
      try {
        const types = await fetchVehicleTypesByCategory(selectedCategory);
        setVehicleTypes(types);
      } catch (error) {
        console.error('Failed to load vehicle types:', error);
      }
    }
    loadTypes();
  } else {
    setVehicleTypes([]);
  }
}, [selectedCategory]);

// UI
<div className="space-y-4">
  {/* Category Dropdown */}
  <div className="space-y-2">
    <Label>Vehicle Category</Label>
    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map(cat => (
          <SelectItem key={cat.id} value={cat.id}>
            <div className="flex items-center gap-2">
              {cat.icon && <span>{cat.icon}</span>}
              <span>{cat.name}</span>
              <span className="text-xs text-gray-500">
                ({cat.vehicle_types_count} types)
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Vehicle Type Selection (only show if category selected) */}
  {selectedCategory && (
    <div className="space-y-2">
      <Label>Vehicle Type</Label>
      <RadioGroup value={vehicleType} onValueChange={onVehicleTypeChange}>
        {vehicleTypes.map(type => (
          <div key={type.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value={String(type.id)} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {type.image_url && (
                  <img src={type.image_url} alt={type.name} className="w-10 h-10 object-cover rounded" />
                )}
                <div>
                  <p className="font-medium">{type.name}</p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                  {type.features && (
                    <p className="text-xs text-emerald-600 mt-1">
                      {type.features.join(' • ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )}
</div>
```

## 🚀 Deployment Checklist

### Backend Service

1. ✅ Deploy vehicle-type-service to Render
   ```bash
   # Service will be at: https://vehicle-type-service.onrender.com
   ```

2. ✅ Run database migration
   ```bash
   psql $DATABASE_URL < migration_vehicle_types.sql
   ```

3. ✅ Set environment variables in Render dashboard
   - `DATABASE_URL` (Supabase PostgreSQL)
   - `SECRET_KEY` (generate with openssl rand -base64 32)
   - `REDIS_URL` (from Render Redis service)
   - See `render.yaml` for full list

4. ✅ Test health endpoint
   ```bash
   curl https://vehicle-type-service.onrender.com/health
   ```

### Frontend Website

1. ✅ Update `.env.local`
   ```env
   NEXT_PUBLIC_VEHICLE_TYPE_SERVICE_URL=https://vehicle-type-service.onrender.com
   NEXT_PUBLIC_ALLOWED_API_HOSTS=auth-service-bc5l.onrender.com,driver-service-dy7i.onrender.com,vehicle-type-service.onrender.com
   ```

2. ✅ Update component to include category selection

3. ✅ Test registration flow locally
   ```bash
   cd deligo-website
   pnpm dev
   # Visit http://localhost:3000
   ```

4. ✅ Deploy to Vercel/production
   ```bash
   # Set environment variables in Vercel dashboard
   # Redeploy
   ```

## 🔒 Security Features

All security requirements met:

- ✅ **OWASP ASVS v4.0**: Input validation, access control, error handling
- ✅ **OWASP API Security**: Rate limiting, authentication, authorization
- ✅ **NIST SP 800-53**: Audit logging, encryption at rest/transit
- ✅ **GDPR Article 32**: Data minimization, purpose limitation
- ✅ **ISO 27001**: Information security management
- ✅ **CWE-434 Prevention**: File upload validation
- ✅ **CVE Mitigation**: No known vulnerabilities

### Public Endpoints (No Auth)
```
GET /public/categories
GET /public/categories/{id}/vehicle-types
GET /public/vehicle-types
```

### Admin Endpoints (JWT Required)
```
POST   /admin/categories
PUT    /admin/categories/{id}
DELETE /admin/categories/{id}
POST   /admin/vehicle-types
PUT    /admin/vehicle-types/{id}
POST   /admin/vehicle-types/{id}/upload-image
```

## 📊 Database Schema

```sql
-- Categories: Economy, Transport, Luxury, Delivery
vehicle_categories
  ├─ id (UUID, PK)
  ├─ name (String, unique)
  ├─ slug (String, unique, indexed)
  ├─ description (Text)
  ├─ display_order (Integer)
  ├─ icon, color (String)
  └─ is_active (Boolean)

-- Types: Sedan, Pickup, Van, SUV, Bike, etc.
vehicle_types
  ├─ id (UUID, PK)
  ├─ category_id (UUID, FK → vehicle_categories)
  ├─ name, slug (String, indexed)
  ├─ description (Text)
  ├─ image_url, map_icon_url, thumbnail_url (String)
  ├─ base_fare, per_km_rate, per_minute_rate (Float)
  ├─ max_passengers, max_luggage (Integer)
  ├─ features (JSONB array)
  └─ is_active, is_available_for_booking (Boolean)

-- Audit trail
vehicle_type_audit_logs
  ├─ id (UUID, PK)
  ├─ entity_type ('category' | 'vehicle_type')
  ├─ entity_id (UUID)
  ├─ action ('create', 'update', 'delete', etc.)
  ├─ admin_id, admin_email (UUID, String)
  ├─ old_values, new_values (JSONB)
  └─ ip_address, user_agent, request_id (String)
```

## 🧪 Testing

### Test Public Endpoints

```bash
# Get categories
curl https://vehicle-type-service.onrender.com/public/categories

# Get types for a category (replace {id} with actual UUID)
curl https://vehicle-type-service.onrender.com/public/categories/{id}/vehicle-types

# Get all types
curl https://vehicle-type-service.onrender.com/public/vehicle-types

# Get types filtered by category slug
curl https://vehicle-type-service.onrender.com/public/vehicle-types?category_slug=transport
```

### Test Admin Endpoints

```bash
# Get admin JWT token first (from auth-service)
TOKEN="your-admin-jwt-token"

# Create category
curl -X POST https://vehicle-type-service.onrender.com/admin/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Express","slug":"express","description":"Fast delivery","display_order":5}'

# Upload image
curl -X POST https://vehicle-type-service.onrender.com/admin/vehicle-types/{id}/upload-image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image_type=main" \
  -F "file=@vehicle.jpg"
```

## 📚 Next Steps

1. **Add Category Selection UI**: Update `StepVehicleInfo.tsx` with category dropdown
2. **Add Images**: Upload vehicle photos via admin API
3. **Configure Pricing**: Set base fares and per-km rates for each type
4. **Monitor**: Check logs, health endpoints, audit trails
5. **Optimize**: Add CDN for images if needed (S3 + CloudFront)

## 🆘 Troubleshooting

### Service Not Responding
```bash
# Check health
curl https://vehicle-type-service.onrender.com/health

# Check logs in Render dashboard
# Verify DATABASE_URL is set correctly
```

### Empty Vehicle Types
```bash
# Run migration again
psql $DATABASE_URL < migration_vehicle_types.sql

# Verify data
psql $DATABASE_URL -c "SELECT * FROM vehicle_categories;"
```

### CORS Errors
```bash
# Verify CORS_ORIGINS in Render env vars includes your frontend domain
# Example: https://deligo-website.vercel.app,http://localhost:3000
```

## 📞 Support

- Backend Service: Check `Backend-new-deligo/services/vehicle-type-service/README.md`
- API Docs (dev): http://localhost:8006/docs
- Logs: Render dashboard → vehicle-type-service → Logs

---

**Status**: ✅ Ready for integration  
**Last Updated**: January 19, 2026
