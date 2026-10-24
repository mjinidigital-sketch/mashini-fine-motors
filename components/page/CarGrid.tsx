'use client'

import { useQuery, usePreloadedQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState, useContext } from 'react'
import { Preloaded } from 'convex/react'
import CarCard from './CarCard'
import { Filters, FilterContext } from './VehiclesFilter'

const ITEMS_PER_PAGE = 12

interface CarGridProps {
  preloadedVehicles?: Preloaded<typeof api.vehicles.listActive>
}

export default function CarGrid({ preloadedVehicles }: CarGridProps) {
  const { filters, setFilters } = useContext(FilterContext)
  const [currentPage, setCurrentPage] = useState(1)

  // Use preloaded data if available, otherwise fall back to client-side query
  const vehicles = preloadedVehicles
    ? usePreloadedQuery(preloadedVehicles)
    : useQuery(api.vehicles.listActive, filters) || []

  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentVehicles = vehicles.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  return (
    <>
      <div className="mt-4 text-sm text-black/60">
        {vehicles.length} vehicles found
      </div>

      {currentVehicles.length > 0 ? (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-3 lg:grid-cols-4">
            {currentVehicles.map((vehicle) => (
              <CarCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-xs font-bold uppercase disabled:opacity-50 hover:bg-black/5"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-xs font-bold uppercase ${
                    currentPage === page
                      ? 'text-white'
                      : 'text-black/70 hover:text-black'
                  }`}
                  style={
                    currentPage === page
                      ? { backgroundColor: 'var(--brand-primary)' }
                      : { backgroundColor: 'var(--brand-light-bg)' }
                  }
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-xs font-bold uppercase disabled:opacity-50 hover:bg-black/5"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-12 text-center py-12 bg-white">
          <p className="text-lg font-bold">No vehicles found</p>
          <p className="mt-2 text-sm text-black/60">Try adjusting your filters</p>
        </div>
      )}
    </>
  )
}
