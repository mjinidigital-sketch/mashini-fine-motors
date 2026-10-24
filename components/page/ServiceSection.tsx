import Link from 'next/link'
import { Car, ShoppingBag, Shield, MapPin } from 'lucide-react'

export default function ServiceSection() {
  const services = [
    {
      title: 'Sell Your Car',
      description: 'Get the best value for your vehicle with our quick and easy selling process.',
      icon: Car,
      href: '/sell'
    },
    {
      title: 'Buy a Car',
      description: 'Browse our extensive inventory of quality vehicles at competitive prices.',
      icon: ShoppingBag,
      href: '/vehicles'
    },
    {
      title: 'Insurance',
      description: 'Protect your investment with comprehensive insurance coverage options.',
      icon: Shield,
      href: '/insurance'
    },
    {
      title: 'Tracking',
      description: 'Track your vehicle location and status with real-time GPS monitoring.',
      icon: MapPin,
      href: '/tracking'
    },
  ]

  return (
    <section id="service" className="px-5 py-16 lg:px-10" style={{ backgroundColor: 'var(--brand-light-bg-secondary)' }}>
      <div className="mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <p className="text-xs font-black uppercase tracking-[.2em]" style={{ color: 'var(--brand-primary)' }}>
            Our Services
          </p>
          <h2 className="text-3xl font-black uppercase">Everything you need</h2>
          <p className="text-sm leading-7 text-black/60 max-w-2xl mx-auto">
            From buying to selling, insurance to tracking - we've got you covered every step of the way.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-xl"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <service.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-black uppercase text-lg" style={{ color: 'var(--brand-dark)' }}>
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-black/60">
                {service.description}
              </p>
              <div className="mt-4 text-xs font-bold uppercase" style={{ color: 'var(--brand-primary)' }}>
                Learn more →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
