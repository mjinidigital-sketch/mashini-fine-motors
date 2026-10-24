'use client'

import { useQuery, usePreloadedQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Preloaded } from 'convex/react'
import CarCard from './CarCard'
import FilterBar from './FilterBar'
import { useState } from 'react'

interface InventorySectionProps {
  limit?: number
  showExploreMore?: boolean
  showFilter?: boolean
  preloadedFeatured?: Preloaded<typeof api.vehicles.listFeatured>
}

export default function InventorySection({ limit, showExploreMore = false, showFilter = false, preloadedFeatured }: InventorySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState(showFilter ? 'All' : '')
  const [searchQuery, setSearchQuery] = useState('')

  // Use preloaded data if available, otherwise fall back to client-side query
  const vehicles = preloadedFeatured
    ? usePreloadedQuery(preloadedFeatured)
    : useQuery(api.vehicles.listFeatured, { limit: limit || 6 }) || []

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (showFilter && selectedCategory && selectedCategory !== 'All') {
      return vehicle.category === selectedCategory
    }
    if (showFilter && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      return vehicle.title.toLowerCase().includes(query) ||
             vehicle.make.toLowerCase().includes(query) ||
             vehicle.model.toLowerCase().includes(query)
    }
    return true
  })

  return (
    <section id="inventory" className="mx-auto max-w-7xl px-5 pb-20 pt-44 lg:px-10 lg:pt-48">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em]" style={{ color: 'var(--brand-primary)' }}>
            Our selection
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-.04em] sm:text-4xl">Featured inventory</h2>
        </div>
        <div className="hidden text-right text-xs text-black/50 sm:block">
          {filteredVehicles.length} vehicles available
          {showExploreMore && (
            <>
              <br />
              <a href="/cars" className="font-bold" style={{ color: 'var(--brand-primary)' }}>
                View all inventory →
              </a>
            </>
          )}
        </div>
      </div>

      {showFilter && (
        <div className="mt-6">
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <CarCard key={vehicle._id} vehicle={vehicle} />
        ))}
      </div>

      {showExploreMore && (
        <div className="mt-8 text-center">
          <a
            href="/cars"
            className="inline-block px-8 py-3 text-xs font-black uppercase text-white hover:bg-[var(--brand-primary-hover)]"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          >
            Explore More Cars
          </a>
        </div>
      )}
    </section>
  )
}
