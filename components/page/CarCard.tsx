'use client'

import { Heart, MapPin } from 'lucide-react'
import { Id } from '@/convex/_generated/dataModel'
import Link from 'next/link'
import { useState } from 'react'

interface Vehicle {
  _id: Id<'vehicles'>
  slug?: string | null
  title: string
  make: string
  model: string
  year: number
  price: number
  currency: string
  mileage: number
  mileageUnit: string
  city: string
  country: string
  condition: 'brand_new' | 'foreign_used' | 'locally_used'
  category: string
  images: string[]
  thumbnailUrl?: string
  featured?: boolean
  accidentFree?: boolean
  femaleOwned?: boolean
}

interface CarCardProps {
  vehicle: Vehicle
  isSaved?: boolean
  onToggleSave?: (id: Id<'vehicles'>) => void
}

const DEAD_MANUFACTURER_DOMAINS = [
  'toyota.com',
  'bmw.com',
  'mercedes-benz.com',
  'audi.com',
  'honda.com',
  'ford.com',
  'vw.com',
  'nissanusa.com',
  'hyundai.com',
  'kia.com',
  'mazda.com',
  'subaru.com',
]

function isDeadUrl(url?: string): boolean {
  if (!url?.trim()) return true

  try {
    const parsedUrl = new URL(url)
    return DEAD_MANUFACTURER_DOMAINS.includes(
      parsedUrl.hostname.toLowerCase(),
    )
  } catch {
    return true
  }
}

export default function CarCard({
  vehicle,
  isSaved = false,
  onToggleSave,
}: CarCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  const imageSrc =
    (!isDeadUrl(vehicle.thumbnailUrl) && vehicle.thumbnailUrl) ||
    (!isDeadUrl(vehicle.images?.[0]) && vehicle.images?.[0]) ||
    null

  const conditionLabel =
    vehicle.condition === 'brand_new'
      ? 'New'
      : vehicle.condition === 'foreign_used'
        ? 'Imported'
        : 'Local'

  const vehicleSlug = vehicle.slug || vehicle._id

  return (
    <article className="group overflow-hidden border border-black/5 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative">
        <div className="relative aspect-[1.4] overflow-hidden bg-gradient-to-br from-black/[0.02] to-black/[0.05]">
          <Link
            href={`/vehicles/${vehicleSlug}`}
            className="block w-full"
            aria-label={`View details for ${vehicle.title}`}
          >
            {imageSrc && !imageFailed ? (
              <img
                src={imageSrc}
                alt={vehicle.title}
                onError={() => setImageFailed(true)}
                className="size-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="size-full flex items-center justify-center">
                <svg
                  className="size-12 text-black/10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            )}

            {vehicle.featured && (
              <span
                className="absolute left-3 top-3 px-3 py-1.5 text-[10px] font-black uppercase text-white shadow-lg"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Featured
              </span>
            )}

            {vehicle.accidentFree && (
              <span
                className="absolute bottom-3 left-3 px-2 py-1 text-[10px] font-bold text-white shadow-lg"
                style={{
                  backgroundColor: 'var(--brand-dark)',
                  opacity: 0.9,
                }}
              >
                Accident Free
              </span>
            )}
          </Link>

          {onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(vehicle._id)}
              className="absolute right-3 top-3 z-10 grid size-9 place-items-center bg-white/95 transition-all hover:bg-white hover:scale-110 shadow-md"
              aria-label={
                isSaved ? 'Remove from saved vehicles' : 'Save vehicle'
              }
              aria-pressed={isSaved}
            >
              <Heart
                className="size-4 transition-all"
                style={
                  isSaved
                    ? {
                      fill: 'var(--brand-primary)',
                      color: 'var(--brand-primary)',
                    }
                    : {}
                }
              />
            </button>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-base font-bold mb-3 truncate leading-tight" style={{ color: 'var(--brand-dark)' }}>
            {vehicle.title}
          </h3>

          <div className="mb-4 border-b" style={{ borderColor: 'var(--brand-light-bg-secondary)' }}></div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold" style={{ color: 'var(--brand-text-dark)' }}>
                  {vehicle.year}
                </p>
                <span className="text-xs" style={{ color: 'var(--brand-text-dark)', opacity: 0.3 }}>
                  ·
                </span>
                <p className="text-xs" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                  {vehicle.mileage.toLocaleString()} {vehicle.mileageUnit}
                </p>
              </div>
              <span
                className="px-2 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: 'var(--brand-light-bg-secondary)',
                  color: 'var(--brand-text-dark)',
                }}
              >
                {conditionLabel}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs font-medium" style={{ color: 'var(--brand-text-dark)', opacity: 0.8 }}>
                {vehicle.make} {vehicle.model}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="size-3" style={{ color: 'var(--brand-text-dark)', opacity: 0.5 }} />
              <p className="text-xs" style={{ color: 'var(--brand-text-dark)', opacity: 0.5 }}>
                {vehicle.city}, {vehicle.country}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--brand-light-bg-secondary)' }}>
            <p className="text-sm font-bold" style={{ color: 'var(--brand-dark)' }}>
              {vehicle.currency} {vehicle.price.toLocaleString()}
            </p>
            <Link
              href={`/vehicles/${vehicleSlug}`}
              className="px-6 py-2.5 text-xs font-bold uppercase text-white transition-all hover:opacity-90 hover:shadow-md"
              style={{ backgroundColor: 'var(--brand-dark)' }}
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}