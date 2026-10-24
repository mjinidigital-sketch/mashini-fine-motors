import ContactForm from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <main style={{ backgroundColor: 'var(--brand-light-bg)', color: 'var(--brand-text-dark)' }}>
      {/* Hero Section */}
      <section
        className="py-20 md:py-32"
        style={{ backgroundColor: 'var(--brand-dark)' }}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-12 text-center">
          <p
            className="mb-4 text-sm font-bold uppercase tracking-widest"
            style={{ color: 'var(--brand-secondary)' }}
          >
            Get in touch
          </p>
          <h1
            className="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl lg:text-6xl"
            style={{ color: 'white' }}
          >
            Contact
            <span style={{ color: 'var(--brand-secondary)' }}> us</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base leading-relaxed text-white/80 md:text-lg">
            Have questions about our vehicles, insurance, or services? We're here to help. Reach out and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-12">
          <ContactForm />
        </div>
      </section>
    </main>
  )
}
