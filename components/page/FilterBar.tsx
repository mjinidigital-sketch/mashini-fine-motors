'use client'

import { Search } from 'lucide-react'
import { categories } from '@/lib/data'

interface FilterBarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  showSearch?: boolean
}

export default function FilterBar({ selectedCategory, onCategoryChange, searchQuery, onSearchChange, showSearch = true }: FilterBarProps) {
  return (
    <div className="bg-white border border-black/10 p-4 shadow-sm">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange('All')}
              className={`px-4 py-2 text-xs font-bold uppercase transition ${
                selectedCategory === 'All'
                  ? 'text-white'
                  : 'text-black/70 hover:text-black'
              }`}
              style={
                selectedCategory === 'All'
                  ? { backgroundColor: 'var(--brand-primary)' }
                  : { backgroundColor: 'var(--brand-light-bg)' }
              }
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 text-xs font-bold uppercase transition ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'text-black/70 hover:text-black'
                }`}
                style={
                  selectedCategory === category
                    ? { backgroundColor: 'var(--brand-primary)' }
                    : { backgroundColor: 'var(--brand-light-bg)' }
                }
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-black/40" />
              <input
                type="text"
                placeholder="Search cars..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-10 w-full pl-10 pr-4 text-sm border border-black/10 outline-none focus:border-[var(--brand-primary)] md:w-64"
                style={{ color: 'var(--brand-text-dark)' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
