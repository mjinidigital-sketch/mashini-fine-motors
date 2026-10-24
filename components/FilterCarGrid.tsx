'use client'

import { FilterProvider, VehiclesFilter, type Filters } from './page/VehiclesFilter'
import CarGrid from './page/CarGrid'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { Preloaded } from 'convex/react'

interface FilterCarGridProps {
  preloadedVehicles?: Preloaded<typeof api.vehicles.listActive>
  preloadedMakes?: Preloaded<typeof api.vehicles.getUniqueMakes>
  preloadedCities?: Preloaded<typeof api.vehicles.getUniqueCities>
}

export default function FilterCarGrid({
  preloadedVehicles,
  preloadedMakes,
  preloadedCities,
}: FilterCarGridProps) {
  return (
    <FilterProvider>
      <FilterCarGridContent
        preloadedVehicles={preloadedVehicles}
        preloadedMakes={preloadedMakes}
        preloadedCities={preloadedCities}
      />
    </FilterProvider>
  )
}

function FilterCarGridContent({
  preloadedVehicles,
  preloadedMakes,
  preloadedCities,
}: FilterCarGridProps) {
  return (
    <div className="space-y-6">
      <VehiclesFilter
        preloadedMakes={preloadedMakes}
        preloadedCities={preloadedCities}
      />
      <CarGrid preloadedVehicles={preloadedVehicles} />
    </div>
  )
}
