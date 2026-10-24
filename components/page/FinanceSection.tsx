export default function FinanceSection() {
  return (
    <section id="finance" className="px-5 py-16 text-white lg:px-10" style={{ backgroundColor: 'var(--brand-dark)' }}>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em]" style={{ color: 'var(--brand-secondary)' }}>
            Drive home happy
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase sm:text-4xl">Finance your next vehicle.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
            Our finance team is here to make your purchase simple, transparent, and built around you.
          </p>
        </div>
        <button
          className="w-fit px-6 py-3.5 text-xs font-black uppercase hover:bg-[var(--brand-primary-hover)]"
          style={{ backgroundColor: 'var(--brand-secondary)' }}
        >
          Start an application
        </button>
      </div>
    </section>
  )
}
