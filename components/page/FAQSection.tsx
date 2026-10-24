export default function FAQSection() {
  return (
    <section id="about" className="bg-white px-5 py-16 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[.2em]" style={{ color: 'var(--brand-primary)' }}>
          Frequently asked questions
        </p>
        <h2 className="mt-2 text-3xl font-black uppercase">Good questions. Straight answers.</h2>
        <div className="mt-8 divide-y border-y">
          <details className="py-5">
            <summary className="cursor-pointer text-sm font-black uppercase">Can I trade in my current vehicle?</summary>
            <p className="mt-3 text-sm leading-6 text-black/60">
              Yes. Bring your vehicle in or contact our team for a quick, no-pressure appraisal.
            </p>
          </details>
          <details className="py-5">
            <summary className="cursor-pointer text-sm font-black uppercase">Do you offer financing?</summary>
            <p className="mt-3 text-sm leading-6 text-black/60">
              Our finance specialists work with a range of lenders to help find an option that fits.
            </p>
          </details>
          <details className="py-5">
            <summary className="cursor-pointer text-sm font-black uppercase">Can I reserve a vehicle online?</summary>
            <p className="mt-3 text-sm leading-6 text-black/60">
              Start with the vehicle details form and our team will confirm availability and next steps.
            </p>
          </details>
        </div>
      </div>
    </section>
  )
}
