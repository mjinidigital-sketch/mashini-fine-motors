export default function SpecialsSection() {
  return (
    <section id="specials" className="bg-white px-5 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-xl">
          <p className="text-xs font-black uppercase tracking-[.2em]" style={{ color: 'var(--brand-primary)' }}>
            The Summit standard
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-.04em] sm:text-4xl">Buy with confidence.</h2>
          <p className="mt-4 text-sm leading-7 text-black/60">
            Every vehicle is hand-selected, transparently priced, and inspected before it reaches our showroom.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border-t-2 pt-4" style={{ borderColor: 'var(--brand-primary)' }}>
            <h3 className="font-black uppercase">Quality checked</h3>
            <p className="mt-2 text-sm leading-6 text-black/55">A thorough multi-point inspection comes standard.</p>
          </div>
          <div className="border-t-2 pt-4" style={{ borderColor: 'var(--brand-primary)' }}>
            <h3 className="font-black uppercase">Transparent pricing</h3>
            <p className="mt-2 text-sm leading-6 text-black/55">Know exactly what you are paying before you visit.</p>
          </div>
          <div className="border-t-2 pt-4" style={{ borderColor: 'var(--brand-primary)' }}>
            <h3 className="font-black uppercase">Personal service</h3>
            <p className="mt-2 text-sm leading-6 text-black/55">Our team makes every step simple and pressure-free.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
