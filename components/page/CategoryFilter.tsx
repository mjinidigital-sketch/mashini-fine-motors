'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface FilterOptions {
  carType: string
  priceRange: string
  location: string
  make: string
  yearRange: string
  mileage: string
}

interface CategoryFilterProps {
  onFilterChange: (filters: FilterOptions) => void
}

const carTypes = ['All', 'Sports', 'SUV', 'Electric', 'Luxury', 'Sedan']
const priceRanges = ['All', 'Under $50k', '$50k - $100k', '$100k - $150k', '$150k - $200k', 'Over $200k']
const locations = ['All', 'Austin, TX', 'Los Angeles, CA', 'Miami, FL', 'Seattle, WA', 'Denver, CO', 'San Francisco, CA', 'Chicago, IL', 'Boston, MA', 'Phoenix, AZ', 'Las Vegas, NV', 'Atlanta, GA', 'New York, NY', 'Houston, TX', 'Philadelphia, PA', 'San Diego, CA', 'Washington, DC', 'Portland, OR']
const makes = ['All', 'Porsche', 'Mercedes-Benz', 'BMW', 'Audi', 'Tesla', 'Lamborghini', 'Land Rover', 'Ferrari', 'McLaren', 'Range Rover', 'Bentley']
const yearRanges = ['All', '2020', '2021', '2022', '2023']
const mileages = ['All', 'Under 5k', '5k - 10k', '10k - 20k', '20k - 30k', 'Over 30k']

export default function CategoryFilter({ onFilterChange }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    carType: 'All',
    priceRange: 'All',
    location: 'All',
    make: 'All',
    yearRange: 'All',
    mileage: 'All',
  })

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const resetFilters = () => {
    const resetOptions: FilterOptions = {
      carType: 'All',
      priceRange: 'All',
      location: 'All',
      make: 'All',
      yearRange: 'All',
      mileage: 'All',
    }
    setFilters(resetOptions)
    onFilterChange(resetOptions)
  }

  const activeFiltersCount = Object.values(filters).filter((v) => v !== 'All').length

  return (
    <div className="bg-white border border-black/10 shadow-sm">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-5 py-4 hover:bg-black/5 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold uppercase">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold text-white" style={{ backgroundColor: 'var(--brand-primary)' }}>
              {activeFiltersCount}
            </span>
          )}
        </div>
        <ChevronDown className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Options */}
      {isOpen && (
        <div className="border-t border-black/10">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase">Filter by</h3>
              <button
                onClick={resetFilters}
                className="text-xs font-bold uppercase hover:text-[var(--brand-primary)]"
              >
                Reset all
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Car Type */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-black/60">Car Type</label>
                <div className="relative">
                  <select
                    value={filters.carType}
                    onChange={(e) => handleFilterChange('carType', e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-black/10 outline-none appearance-none bg-white cursor-pointer"
                    style={{ color: 'var(--brand-text-dark)' }}
                  >
                    {carTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-black/40" />
                </div>
              </div>

              {/* Price Range */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-black/60">Price Range</label>
                <div className="relative">
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-black/10 outline-none appearance-none bg-white cursor-pointer"
                    style={{ color: 'var(--brand-text-dark)' }}
                  >
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-black/40" />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-black/60">Location</label>
                <div className="relative">
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-black/10 outline-none appearance-none bg-white cursor-pointer"
                    style={{ color: 'var(--brand-text-dark)' }}
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-black/40" />
                </div>
              </div>

              {/* Make */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-black/60">Make</label>
                <div className="relative">
                  <select
                    value={filters.make}
                    onChange={(e) => handleFilterChange('make', e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-black/10 outline-none appearance-none bg-white cursor-pointer"
                    style={{ color: 'var(--brand-text-dark)' }}
                  >
                    {makes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-black/40" />
                </div>
              </div>

              {/* Year Range */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-black/60">Year</label>
                <div className="relative">
                  <select
                    value={filters.yearRange}
                    onChange={(e) => handleFilterChange('yearRange', e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-black/10 outline-none appearance-none bg-white cursor-pointer"
                    style={{ color: 'var(--brand-text-dark)' }}
                  >
                    {yearRanges.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-black/40" />
                </div>
              </div>

              {/* Mileage */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-black/60">Mileage</label>
                <div className="relative">
                  <select
                    value={filters.mileage}
                    onChange={(e) => handleFilterChange('mileage', e.target.value)}
                    className="w-full h-10 px-3 text-sm border border-black/10 outline-none appearance-none bg-white cursor-pointer"
                    style={{ color: 'var(--brand-text-dark)' }}
                  >
                    {mileages.map((mileage) => (
                      <option key={mileage} value={mileage}>
                        {mileage}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none text-black/40" />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t border-black/10">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (value === 'All') return null
                    return (
                      <button
                        key={key}
                        onClick={() => handleFilterChange(key as keyof FilterOptions, 'All')}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase bg-black/5 hover:bg-black/10"
                      >
                        {value}
                        <X className="size-3" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
