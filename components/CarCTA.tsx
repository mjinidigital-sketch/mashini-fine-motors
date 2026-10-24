import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CarCTA() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--brand-dark)' }}
    >
      <div className="relative mx-auto max-w-7xl px-4 md:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left side - Dark background with text */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <p
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: 'var(--brand-secondary)' }}
              >
                Ready to drive?
              </p>
              <h2
                className="text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-4xl lg:text-5xl"
                style={{ color: 'white' }}
              >
                Find your
                <span style={{ color: 'var(--brand-secondary)' }}> perfect</span> car today
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
                Browse our curated selection of premium vehicles. Each car is thoroughly inspected and ready for the road.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/vehicles"
                className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                Browse Inventory
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/financing"
                className="inline-flex items-center gap-2 border-2 border-white/30 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white hover:text-[var(--brand-dark)]"
              >
                Get Pre-Approved
              </Link>
            </div>
          </div>

          {/* Right side - Car image */}
          <div className="relative -ml-24">
            <div className="relative h-[500px] md:h-[600px]">
              <img
                src="/car-red.jpg"
                alt="Luxury car"
                className="h-full w-full object-cover object-left-center"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[var(--brand-dark)]/20 to-[var(--brand-dark)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--brand-dark)]/20 to-[var(--brand-dark)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[var(--brand-dark)]/20 to-[var(--brand-dark)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--brand-dark)]/20 to-[var(--brand-dark)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
