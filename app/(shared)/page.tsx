export const dynamic = 'force-dynamic'

import TopBar from '@/components/page/TopBar'
import Header from '@/components/page/Header'
import HeroSection from '@/components/page/HeroSection'
import InventorySection from '@/components/page/InventorySection'
import FinanceSection from '@/components/page/FinanceSection'
import SpecialsSection from '@/components/page/SpecialsSection'
import ServiceSection from '@/components/page/ServiceSection'
import FAQSection from '@/components/page/FAQSection'
import Footer from '@/components/page/Footer'
import { preloadQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import FeaturedCarGrid from '@/components/FeaturedCarGrid'
import LimitedCarGrid from '@/components/LimitedCarGrid'
import CarCTA from '@/components/CarCTA'
import AlternativeCTA from '@/components/AlternativeCTA'
import InsuranceLogos from '@/components/InsuranceLogos'
import ContactForm from '@/components/ContactForm'

export default async function Page() {

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--brand-light-bg)', color: 'var(--brand-text-dark)' }}>

      <HeroSection />
      <FeaturedCarGrid />
      <CarCTA />

      <LimitedCarGrid />
      {/* <InventorySection />
      <FinanceSection />
      <SpecialsSection /> */}
      <AlternativeCTA />
      {/* <InsuranceLogos /> */}
      <ServiceSection />

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-12">
          <div className="text-center space-y-4 mb-12">
            <h2
              className="text-3xl font-black uppercase md:text-4xl"
              style={{ color: 'var(--brand-dark)' }}
            >
              Get in touch
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <FAQSection />

    </main>
  )
}
