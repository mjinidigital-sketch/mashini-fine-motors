'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'

interface VehicleGalleryProps {
  images: string[]
  title: string
}

export default function VehicleGallery({ images, title }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div
        className="flex aspect-[16/9] w-full items-center justify-center bg-gray-100"
        aria-label="No images available"
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <ImageOff className="size-12" />
          <p className="text-sm font-semibold">No images available</p>
        </div>
      </div>
    )
  }

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '16/9' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeIndex}
          src={images[activeIndex]}
          alt={`${title} — image ${activeIndex + 1}`}
          className="size-full object-cover transition-opacity duration-300"
          style={{ display: 'block' }}
        />

        {/* Counter badge */}
        <span className="absolute bottom-3 right-3 bg-black/60 px-2 py-1 text-xs font-bold text-white">
          {activeIndex + 1} / {images.length}
        </span>

        {/* Prev / Next arrows — only show when more than one image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center bg-black/50 text-white transition hover:bg-black/80"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center bg-black/50 text-white transition hover:bg-black/80"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip — only show when more than one image */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className="shrink-0 overflow-hidden transition"
              style={{
                width: 72,
                height: 54,
                outline: i === activeIndex ? '2px solid var(--brand-primary)' : '2px solid transparent',
                outlineOffset: 2,
                opacity: i === activeIndex ? 1 : 0.6,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${title} thumbnail ${i + 1}`}
                className="size-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
