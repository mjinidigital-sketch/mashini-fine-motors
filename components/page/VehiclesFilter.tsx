'use client'

import { useState, useContext, createContext } from 'react'
import { useQuery, usePreloadedQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Preloaded } from 'convex/react'
import { ChevronDown, X } from 'lucide-react'

export interface Filters {
  category?: string
  make?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  maxMileage?: number
  searchQuery?: string
}

// ── Shared filter context ────────────────────────────────────────────────────
export const FilterContext = createContext<{
  filters: Filters
  setFilters: (filters: Filters) => void
}>({
  filters: {},
  setFilters: () => {},
})

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>({})
  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  )
}
// ────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'All', 'sedan', 'suv', 'pickup', 'ev', 'hatchback', 'coupe',
  'convertible', 'station_wagon', 'van', 'minibus', 'bus',
  'lorry', 'bike', 'farm_equipment', 'heavy_machinery',
]
const PRICE_RANGES   = ['All', 'Under 500K', '500K - 1M', '1M - 2M', '2M - 5M', '5M - 10M', 'Over 10M']
const YEAR_RANGES    = ['All', '2010-2015', '2015-2020', '2020-2022', '2022-2024']
const MILEAGE_RANGES = ['All', 'Under 10k', '10k - 30k', '30k - 50k', '50k - 100k', 'Over 100k']

interface RangeSelections {
  priceRange: string
  yearRange: string
  mileageRange: string
}

interface VehiclesFilterProps {
  preloadedMakes?: Preloaded<typeof api.vehicles.getUniqueMakes>
  preloadedCities?: Preloaded<typeof api.vehicles.getUniqueCities>
}

export function VehiclesFilter({ preloadedMakes, preloadedCities }: VehiclesFilterProps) {
  const { filters, setFilters } = useContext(FilterContext)
  const [ranges, setRanges]     = useState<RangeSelections>({
    priceRange: 'All',
    yearRange: 'All',
    mileageRange: 'All',
  })

  // Use preloaded data if available, otherwise fall back to client-side query
  const makes  = preloadedMakes
    ? usePreloadedQuery(preloadedMakes)
    : useQuery(api.vehicles.getUniqueMakes) || []
  const cities = preloadedCities
    ? usePreloadedQuery(preloadedCities)
    : useQuery(api.vehicles.getUniqueCities) || []

  const set = (key: keyof Filters, value: string | number | undefined) => {
    setFilters({ ...filters, [key]: value || undefined })
  }

  const handlePriceRange = (range: string) => {
    setRanges((r) => ({ ...r, priceRange: range }))
    const map: Record<string, { min?: number; max?: number }> = {
      'Under 500K': {                  max: 500_000 },
      '500K - 1M':  { min: 500_000,   max: 1_000_000 },
      '1M - 2M':    { min: 1_000_000, max: 2_000_000 },
      '2M - 5M':    { min: 2_000_000, max: 5_000_000 },
      '5M - 10M':   { min: 5_000_000, max: 10_000_000 },
      'Over 10M':   { min: 10_000_000 },
    }
    const { min, max } = map[range] ?? {}
    setFilters({ ...filters, minPrice: min, maxPrice: max })
  }

  const handleYearRange = (range: string) => {
    setRanges((r) => ({ ...r, yearRange: range }))
    const map: Record<string, { min?: number; max?: number }> = {
      '2010-2015': { min: 2010, max: 2015 },
      '2015-2020': { min: 2015, max: 2020 },
      '2020-2022': { min: 2020, max: 2022 },
      '2022-2024': { min: 2022, max: 2024 },
    }
    const { min, max } = map[range] ?? {}
    setFilters({ ...filters, minYear: min, maxYear: max })
  }

  const handleMileageRange = (range: string) => {
    setRanges((r) => ({ ...r, mileageRange: range }))
    const maxMap: Record<string, number | undefined> = {
      'Under 10k':   10_000,
      '10k - 30k':   30_000,
      '30k - 50k':   50_000,
      '50k - 100k': 100_000,
      'Over 100k':  undefined,
    }
    setFilters({ ...filters, maxMileage: maxMap[range] })
  }

  const resetAll = () => {
    setFilters({})
    setRanges({ priceRange: 'All', yearRange: 'All', mileageRange: 'All' })
  }

  const activeCount = Object.values(filters).filter((v) => v !== undefined).length

  return (
    <div className="p-5 shadow-2xl" style={{ backgroundColor: 'var(--brand-dark)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-white">Filter vehicles</h2>
        {activeCount > 0 && (
          <button
            onClick={resetAll}
            className="text-[10px] font-bold uppercase text-white/70 hover:text-white transition"
          >
            Reset all
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
        <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
          <span className="truncate">Category</span>
          <select
            value={filters.category || ''}
            onChange={(e) => set('category', e.target.value)}
            className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
            style={{ color: 'var(--brand-text-dark)' }}
          >
            <option value="">All</option>
            {CATEGORIES.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
          <span className="truncate">Make</span>
          <select
            value={filters.make || ''}
            onChange={(e) => set('make', e.target.value)}
            className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
            style={{ color: 'var(--brand-text-dark)' }}
          >
            <option value="">All</option>
            {makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
          <span className="truncate">Location</span>
          <select
            value={filters.city || ''}
            onChange={(e) => set('city', e.target.value)}
            className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
            style={{ color: 'var(--brand-text-dark)' }}
          >
            <option value="">All</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
          <span className="truncate">Price Range</span>
          <select
            value={ranges.priceRange}
            onChange={handlePriceRange}
            className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
            style={{ color: 'var(--brand-text-dark)' }}
          >
            {PRICE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
          <span className="truncate">Year</span>
          <select
            value={ranges.yearRange}
            onChange={handleYearRange}
            className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
            style={{ color: 'var(--brand-text-dark)' }}
          >
            {YEAR_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
          <span className="truncate">Mileage</span>
          <select
            value={ranges.mileageRange}
            onChange={handleMileageRange}
            className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
            style={{ color: 'var(--brand-text-dark)' }}
          >
            {MILEAGE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
      </div>

      {activeCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.category && (
            <Chip label={filters.category} onRemove={() => set('category', undefined)} />
          )}
          {filters.make && (
            <Chip label={filters.make} onRemove={() => set('make', undefined)} />
          )}
          {filters.city && (
            <Chip label={filters.city} onRemove={() => set('city', undefined)} />
          )}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <Chip
              label={ranges.priceRange}
              onRemove={() => {
                setRanges((r) => ({ ...r, priceRange: 'All' }))
                setFilters({ ...filters, minPrice: undefined, maxPrice: undefined })
              }}
            />
          )}
          {(filters.minYear !== undefined || filters.maxYear !== undefined) && (
            <Chip
              label={ranges.yearRange}
              onRemove={() => {
                setRanges((r) => ({ ...r, yearRange: 'All' }))
                setFilters({ ...filters, minYear: undefined, maxYear: undefined })
              }}
            />
          )}
          {filters.maxMileage !== undefined && (
            <Chip
              label={ranges.mileageRange}
              onRemove={() => {
                setRanges((r) => ({ ...r, mileageRange: 'All' }))
                setFilters({ ...filters, maxMileage: undefined })
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

function SelectField({
  label, value, onChange, children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 px-3 text-sm border border-black/10 outline-none appearance-none bg-white cursor-pointer rounded-md focus:border-[var(--brand-primary)] transition"
          style={{ color: 'var(--brand-text-dark)' }}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" style={{ color: 'var(--brand-text-dark)', opacity: 0.5 }} />
      </div>
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase rounded transition hover:opacity-80"
      style={{
        backgroundColor: 'white',
        color: 'var(--brand-text-dark)',
      }}
    >
      {label}
      <X className="size-3" />
    </button>
  )
}
