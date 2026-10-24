import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AlternativeCTA() {
  return (
    <section
      className="py-16 md:py-20"
      style={{ backgroundColor: 'var(--brand-dark)' }}
    >
      <div className="mx-auto max-w-4xl px-4 md:px-12">
        <div className="text-center space-y-6">
          <h2
            className="text-2xl font-bold uppercase md:text-3xl"
            style={{ color: 'white' }}
          >
            Need help finding the right car?
          </h2>
          <p className="text-sm md:text-base" style={{ color: 'white', opacity: 0.8 }}>
            Our team is here to help you find your perfect vehicle
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 text-xs font-bold uppercase text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-secondary)' }}
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
