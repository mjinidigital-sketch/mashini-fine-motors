export const dynamic = 'force-dynamic'

import { fetchQuery, preloadQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import FilterCarGrid from '@/components/FilterCarGrid'
import { Preloaded } from 'convex/react'

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; make?: string; city?: string }>
}) {
  const { category, make, city } = await searchParams

  // Preload data for the client component
  const preloadedVehicles = await preloadQuery(api.vehicles.listActive, {
    category,
    make,
    city,
  })
  const preloadedMakes = await preloadQuery(api.vehicles.getUniqueMakes)
  const preloadedCities = await preloadQuery(api.vehicles.getUniqueCities)

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--brand-light-bg)' }}>
      <div className="container mx-auto px-4 md:px-12">
        <div className="mb-8">
          <h1
            className="text-4xl font-black uppercase"
            style={{ color: 'var(--brand-dark)' }}
          >
            All Vehicles
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}
          >
            Browse our complete inventory
          </p>
        </div>

        <FilterCarGrid
          preloadedVehicles={preloadedVehicles}
          preloadedMakes={preloadedMakes}
          preloadedCities={preloadedCities}
        />
      </div>
    </div>
  )
}
