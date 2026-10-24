import { MapPin, Phone } from 'lucide-react'

export default function TopBar() {
  return (
    <div className="px-5 py-2 text-[12px] text-white/75 lg:px-10" style={{ backgroundColor: 'var(--brand-dark)' }}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <MapPin className="size-3.5" style={{ color: 'var(--brand-primary)' }} />
          Offices: Westlands Road, Nairobi, Kenya
        </span>
        <span className="hidden items-center gap-2 sm:flex">
          <Phone className="size-3.5" style={{ color: 'var(--brand-primary)' }} />
          +254 700 000 000
        </span>
        <span className="hidden lg:block">
          Sales: Mon - Sat 9am - 7pm <span className="mx-3 text-white/30">|</span> Service: Mon - Sat 7am - 6pm
        </span>
        <span className="flex gap-3 text-[12px] font-black">
          <span>f</span>
          <span>ig</span>
          <span>▶</span>
        </span>
      </div>
    </div>
  )
}
