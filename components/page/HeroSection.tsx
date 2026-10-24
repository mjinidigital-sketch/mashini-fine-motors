'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const router = useRouter()
  const [filters, setFilters] = useState({ make: '', model: '', city: '', year: '', maxPrice: '' })

  const makes = useQuery(api.vehicles.getUniqueMakes) || []
  const cities = useQuery(api.vehicles.getUniqueCities) || []

  const PRICE_RANGES = ['All', 'Under 500K', '500K - 1M', '1M - 2M', '2M - 5M', '5M - 10M', 'Over 10M']
  const YEAR_RANGES = ['All', '2010-2015', '2015-2020', '2020-2022', '2022-2024', '2024+']

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.make) params.set('make', filters.make)
    if (filters.model) params.set('model', filters.model)
    if (filters.city) params.set('city', filters.city)
    if (filters.year && filters.year !== 'All') params.set('yearRange', filters.year)
    if (filters.maxPrice && filters.maxPrice !== 'All') params.set('priceRange', filters.maxPrice)

    router.push(`/vehicles?${params.toString()}`)
  }

  return (
    <section id="top" className="relative min-h-[760px] overflow-visible text-white sm:min-h-[520px]" style={{ backgroundColor: 'var(--brand-dark-secondary)' }}>
      <img src="/car-hero.png" alt="Luxury SUV driving on a mountain road" className="absolute inset-0 size-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-dark-tertiary)]/90 via-[var(--brand-dark-tertiary)]/55 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-5 pb-36 pt-24 lg:px-10 lg:pt-28">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest" style={{ color: 'var(--brand-secondary)' }}>
            Exceptional cars. Exceptional experience.
          </p>
          <h1 className="text-5xl font-black uppercase leading-[.95] tracking-[-.04em] sm:text-7xl">
            Find your<br />
            <span style={{ color: 'var(--brand-secondary)' }}>perfect</span> match.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/80">
            Shop our wide selection of quality new and pre-owned vehicles.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/vehicles"
              className="px-6 py-3 text-xs font-black uppercase shadow-lg hover:bg-[var(--brand-primary-hover)]"
              style={{ backgroundColor: 'var(--brand-secondary)' }}
            >
              Browse inventory
            </a>
            <a href="/financing" className="border border-white/70 px-6 py-3 text-xs font-black uppercase hover:bg-white hover:text-[var(--brand-text-dark)]">
              Get pre-approved
            </a>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-4 left-1/2 w-[calc(100%-1.25rem)] max-w-6xl -translate-x-1/2 p-3 shadow-2xl sm:bottom-[-88px] sm:w-[calc(100%-2.5rem)] sm:p-5 lg:p-7"
        style={{ backgroundColor: 'var(--brand-dark)' }}
      >
        <h2 className="text-sm font-bold uppercase tracking-wide">Search inventory</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
          <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
            <span className="truncate">Make</span>
            <select
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value, model: '' })}
              className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
              style={{ color: 'var(--brand-text-dark)' }}
            >
              <option value="">All Makes</option>
              {makes.map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
            <span className="truncate">Model</span>
            <input
              type="text"
              value={filters.model}
              onChange={(e) => setFilters({ ...filters, model: e.target.value })}
              placeholder="Any Model"
              className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
              style={{ color: 'var(--brand-text-dark)' }}
            />
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
            <span className="truncate">Location</span>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
              style={{ color: 'var(--brand-text-dark)' }}
            >
              <option value="">All Locations</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
            <span className="truncate">Year</span>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
              style={{ color: 'var(--brand-text-dark)' }}
            >
              {YEAR_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-[10px] font-bold text-white/70 sm:gap-2 sm:text-[11px]">
            <span className="truncate">Price Range</span>
            <select
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="h-9 min-w-0 bg-white px-2 text-[10px] font-semibold outline-none sm:h-11 sm:px-3 sm:text-xs"
              style={{ color: 'var(--brand-text-dark)' }}
            >
              {PRICE_RANGES.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </label>

          <button
            onClick={handleSearch}
            className="mt-1 h-9 text-[10px] font-black uppercase transition sm:mt-5 sm:h-11 sm:text-xs md:mt-6 hover:bg-[var(--brand-primary-hover)]"
            style={{ backgroundColor: 'var(--brand-secondary)' }}
          >
            Search
          </button>
        </div>
      </div>
    </section>
  )
}
