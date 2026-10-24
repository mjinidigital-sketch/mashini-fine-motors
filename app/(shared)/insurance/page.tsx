import { Shield, CheckCircle, Clock, HeadphonesIcon, FileText, Car, Scale, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function InsurancePage() {
  return (
    <main style={{ backgroundColor: 'var(--brand-light-bg)', color: 'var(--brand-text-dark)' }}>
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32"
        style={{ backgroundColor: 'var(--brand-dark)' }}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-12">
          <div className="max-w-3xl">
            <p
              className="mb-4 text-sm font-bold uppercase tracking-widest"
              style={{ color: 'var(--brand-secondary)' }}
            >
              Your trusted insurance broker
            </p>
            <h1
              className="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: 'white' }}
            >
              Find the perfect
              <span style={{ color: 'var(--brand-secondary)' }}> insurance</span> for your car
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              We connect you with top insurance providers to get you the best coverage at the best rates. Compare quotes, save money, and get protected.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
              >
                Compare Quotes
              </Link>
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 border-2 border-white/30 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition-all hover:border-white hover:bg-white hover:text-[var(--brand-dark)]"
              >
                Browse Vehicles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-12">
          <div className="text-center space-y-4 mb-12">
            <h2
              className="text-3xl font-black uppercase md:text-4xl"
              style={{ color: 'var(--brand-dark)' }}
            >
              Why use our brokerage?
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
              We make finding the right insurance simple, fast, and affordable
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-8 shadow-md">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <Scale className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase" style={{ color: 'var(--brand-dark)' }}>
                Compare Multiple Providers
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                Get quotes from multiple top insurance companies in one place. Compare coverage, rates, and benefits side by side.
              </p>
            </div>

            <div className="bg-white p-8 shadow-md">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase" style={{ color: 'var(--brand-dark)' }}>
                Expert Advice
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                Our experienced brokers help you understand your options and find the coverage that truly fits your needs.
              </p>
            </div>

            <div className="bg-white p-8 shadow-md">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase" style={{ color: 'var(--brand-dark)' }}>
                Save Money
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
              We negotiate better rates and find discounts you might miss. Our clients save an average of 20% on premiums.
              </p>
            </div>

            <div className="bg-white p-8 shadow-md">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase" style={{ color: 'var(--brand-dark)' }}>
                Time Saving
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                Skip the research and paperwork. We handle everything from quote comparison to policy activation.
              </p>
            </div>

            <div className="bg-white p-8 shadow-md">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <HeadphonesIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase" style={{ color: 'var(--brand-dark)' }}>
                Claims Support
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                We advocate for you during claims. Our team guides you through the process and ensures fair treatment.
              </p>
            </div>

            <div className="bg-white p-8 shadow-md">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase" style={{ color: 'var(--brand-dark)' }}>
                Free Service
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                Our brokerage services are completely free. We're paid by insurance companies, not by you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: 'var(--brand-dark)' }}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-12">
          <div className="text-center space-y-4 mb-12">
            <h2
              className="text-3xl font-black uppercase md:text-4xl"
              style={{ color: 'white' }}
            >
              Coverage we help you find
            </h2>
            <p className="text-base max-w-2xl mx-auto text-white/80">
              We work with our partners to get you the right type of coverage
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-2 p-8" style={{ borderColor: 'var(--brand-secondary)', backgroundColor: 'var(--brand-dark-secondary)' }}>
              <h3 className="text-xl font-black uppercase mb-4" style={{ color: 'var(--brand-secondary)' }}>
                Third-Party
              </h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-secondary)' }} />
                  Legal liability coverage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-secondary)' }} />
                  Third-party property damage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-secondary)' }} />
                  Personal accident cover
                </li>
              </ul>
              <Link
                href="/contact"
                className="mt-6 inline-block w-full border-2 px-6 py-3 text-center text-xs font-black uppercase transition-all hover:bg-white hover:text-[var(--brand-dark)]"
                style={{ borderColor: 'var(--brand-secondary)', color: 'var(--brand-secondary)' }}
              >
                Get Quote
              </Link>
            </div>

            <div className="border-2 p-8" style={{ borderColor: 'var(--brand-primary)', backgroundColor: 'var(--brand-dark-secondary)' }}>
              <div className="mb-2 inline-block px-3 py-1 text-[10px] font-bold uppercase" style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>
                Most Popular
              </div>
              <h3 className="text-xl font-black uppercase mb-4" style={{ color: 'var(--brand-primary)' }}>
                Comprehensive
              </h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
                  All third-party coverage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
                  Own damage protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
                  Theft and fire coverage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-primary)' }} />
                  Natural disaster protection
                </li>
              </ul>
              <Link
                href="/contact"
                className="mt-6 inline-block w-full px-6 py-3 text-center text-xs font-black uppercase text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Get Quote
              </Link>
            </div>

            <div className="border-2 p-8" style={{ borderColor: 'var(--brand-secondary)', backgroundColor: 'var(--brand-dark-secondary)' }}>
              <h3 className="text-xl font-black uppercase mb-4" style={{ color: 'var(--brand-secondary)' }}>
                Premium Add-ons
              </h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-secondary)' }} />
                  Zero depreciation cover
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-secondary)' }} />
                  Engine and gearbox protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-secondary)' }} />
                  Return to invoice value
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" style={{ color: 'var(--brand-secondary)' }} />
                  Roadside assistance
                </li>
              </ul>
              <Link
                href="/contact"
                className="mt-6 inline-block w-full border-2 px-6 py-3 text-center text-xs font-black uppercase transition-all hover:bg-white hover:text-[var(--brand-dark)]"
                style={{ borderColor: 'var(--brand-secondary)', color: 'var(--brand-secondary)' }}
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-12">
          <div className="text-center space-y-4 mb-12">
            <h2
              className="text-3xl font-black uppercase md:text-4xl"
              style={{ color: 'var(--brand-dark)' }}
            >
              How it works
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
              Get insured in 3 simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-black"
                style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
              >
                1
              </div>
              <h3 className="text-lg font-black uppercase mb-2" style={{ color: 'var(--brand-dark)' }}>
                Tell us your needs
              </h3>
              <p className="text-sm" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                Share your vehicle details and coverage requirements with our team
              </p>
            </div>

            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-black"
                style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
              >
                2
              </div>
              <h3 className="text-lg font-black uppercase mb-2" style={{ color: 'var(--brand-dark)' }}>
                We compare quotes
              </h3>
              <p className="text-sm" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                We get quotes from multiple providers and present the best options
              </p>
            </div>

            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-black"
                style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
              >
                3
              </div>
              <h3 className="text-lg font-black uppercase mb-2" style={{ color: 'var(--brand-dark)' }}>
                Get insured
              </h3>
              <p className="text-sm" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
                Choose your plan and we handle the paperwork and activation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-12 text-center">
          <h2
            className="text-3xl font-black uppercase md:text-4xl mb-4"
            style={{ color: 'var(--brand-dark)' }}
          >
            Ready to save on insurance?
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
            Contact us today to compare quotes from top insurance providers
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 text-sm font-black uppercase tracking-wide text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: 'var(--brand-secondary)' }}
          >
            Get Free Quotes
          </Link>
        </div>
      </section>
    </main>
  )
}
