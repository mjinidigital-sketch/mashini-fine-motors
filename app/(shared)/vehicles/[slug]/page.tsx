import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/page/Header'
import Footer from '@/components/page/Footer'
import TopBar from '@/components/page/TopBar'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Fuel,
  Gauge,
  Settings2,
  Car,
  Shield,
  BadgeCheck,
  CalendarDays,
  Layers,
  Paintbrush,
  DoorOpen,
  Zap,
  Info,
  CheckCircle2,
} from 'lucide-react'
import VehicleGallery from '@/components/page/VehicleGallery'

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(str?: string | null) {
  return str ? str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null
}

function fmtNum(n?: number | null) {
  return n != null ? n.toLocaleString() : null
}

const CONDITION_MAP: Record<string, { label: string; color: string }> = {
  brand_new: { label: 'Brand New', color: '#16a34a' },
  foreign_used: { label: 'Foreign Used', color: '#d97706' },
  locally_used: { label: 'Locally Used', color: '#6b7280' },
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  active: { label: 'Available', color: '#16a34a' },
  reserved: { label: 'Reserved', color: '#d97706' },
  sold: { label: 'Sold', color: '#dc2626' },
  draft: { label: 'Draft', color: '#6b7280' },
  pending_approval: { label: 'Pending', color: '#6b7280' },
  archived: { label: 'Archived', color: '#6b7280' },
}

// ─── page ───────────────────────────────────────────────────────────────────

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vehicle = await fetchQuery(api.vehicles.getVehicleBySlug, { slug })

  if (!vehicle) {
    notFound()
  }

  // Related vehicles (same make / category)
  const related = await fetchQuery(api.vehicles.getRelatedVehicles, {
    make: vehicle.make,
    category: vehicle.category,
    excludeId: vehicle._id,
  })

  const condition = CONDITION_MAP[vehicle.condition] ?? { label: fmt(vehicle.condition) ?? '', color: '#6b7280' }
  const status = STATUS_MAP[vehicle.status] ?? { label: fmt(vehicle.status) ?? '', color: '#6b7280' }

  const allImages = [
    ...(vehicle.thumbnailUrl ? [vehicle.thumbnailUrl] : []),
    ...(vehicle.images ?? []).filter((img) => img !== vehicle.thumbnailUrl),
  ]

  const whatsappNumber = vehicle.sellerContactWhatsApp?.replace(/\D/g, '')

  return (
    <>      <main className="min-h-screen" style={{ backgroundColor: 'var(--brand-light-bg)' }}>
      {/* ── Breadcrumb ── */}
      <div style={{ backgroundColor: 'var(--brand-dark)' }}>
        <div className="mx-auto max-w-7xl px-5 py-3 lg:px-10">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/vehicles" className="hover:text-white transition-colors">Vehicles</Link>
            <span>/</span>
            <span className="text-white/90 truncate max-w-[200px]">{vehicle.title}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        {/* Back link */}
        <Link
          href="/vehicles"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase transition-opacity hover:opacity-70"
          style={{ color: 'var(--brand-primary)' }}
        >
          <ArrowLeft className="size-4" />
          Back to vehicles
        </Link>

        {/* ── Main grid ── */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ── LEFT: gallery + specs ── */}
          <div className="space-y-6">

            {/* Gallery */}
            <VehicleGallery images={allImages} title={vehicle.title} />

            {/* Overview */}
            <div className="bg-white shadow-sm p-6">
              <h2 className="mb-5 text-sm font-black uppercase tracking-widest" style={{ color: 'var(--brand-dark)' }}>
                Overview
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                <SpecRow icon={<CalendarDays className="size-4" />} label="Year" value={String(vehicle.year)} />
                <SpecRow icon={<Car className="size-4" />} label="Make" value={vehicle.make} />
                <SpecRow icon={<Info className="size-4" />} label="Model" value={vehicle.model} />
                {vehicle.trim && <SpecRow icon={<Layers className="size-4" />} label="Trim" value={vehicle.trim} />}
                <SpecRow icon={<Gauge className="size-4" />} label="Mileage" value={`${fmtNum(vehicle.mileage)} ${vehicle.mileageUnit}`} />
                <SpecRow icon={<Fuel className="size-4" />} label="Fuel" value={fmt(vehicle.fuelType)} />
                <SpecRow icon={<Settings2 className="size-4" />} label="Transmission" value={fmt(vehicle.transmission)} />
                {vehicle.drivetrain && <SpecRow icon={<Settings2 className="size-4" />} label="Drivetrain" value={vehicle.drivetrain.toUpperCase()} />}
                {vehicle.engineSizeCc && <SpecRow icon={<Zap className="size-4" />} label="Engine" value={`${vehicle.engineSizeCc} cc`} />}
                {vehicle.doorsCount && <SpecRow icon={<DoorOpen className="size-4" />} label="Doors" value={String(vehicle.doorsCount)} />}
                <SpecRow icon={<Paintbrush className="size-4" />} label="Ext. Color" value={vehicle.exteriorColor} />
                {vehicle.interiorColor && <SpecRow icon={<Paintbrush className="size-4" />} label="Int. Color" value={vehicle.interiorColor} />}
                {vehicle.interiorMaterial && <SpecRow icon={<Layers className="size-4" />} label="Interior" value={fmt(vehicle.interiorMaterial)} />}
                {vehicle.seatingCapacity && <SpecRow icon={<Car className="size-4" />} label="Seats" value={String(vehicle.seatingCapacity)} />}
                <SpecRow icon={<MapPin className="size-4" />} label="Location" value={[vehicle.city, vehicle.stateOrCounty, vehicle.country].filter(Boolean).join(', ')} />
              </div>
            </div>

            {/* Condition & Ownership */}
            <div className="bg-white shadow-sm p-6">
              <h2 className="mb-5 text-sm font-black uppercase tracking-widest" style={{ color: 'var(--brand-dark)' }}>
                Condition &amp; History
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <BadgePill active={vehicle.accidentFree} label="Accident Free" />
                <BadgePill active={!vehicle.repainted} label="Original Paint" />
                <BadgePill active={vehicle.femaleOwned} label="Female Owned" />
                <BadgePill active={vehicle.dutyPaid} label="Duty Paid" />
                <BadgePill active={vehicle.logbookAvailable} label="Logbook" />
                {vehicle.keysAvailable != null && (
                  <BadgePill active={vehicle.keysAvailable > 0} label={`${vehicle.keysAvailable} Key(s)`} />
                )}
                {vehicle.warrantyRemainingMonths != null && vehicle.warrantyRemainingMonths > 0 && (
                  <BadgePill active label={`${vehicle.warrantyRemainingMonths}m Warranty`} />
                )}
                {vehicle.numberOfPreviousOwners != null && (
                  <BadgePill active={vehicle.numberOfPreviousOwners <= 1} label={`${vehicle.numberOfPreviousOwners} Owner(s)`} />
                )}
              </div>
              {vehicle.defects && vehicle.defects.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase mb-2 text-red-600">Known Defects</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {vehicle.defects.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Features */}
            {(vehicle.features?.length > 0 || vehicle.safetyFeatures?.length || vehicle.comfortFeatures?.length || vehicle.technologyFeatures?.length) && (
              <div className="bg-white shadow-sm p-6">
                <h2 className="mb-5 text-sm font-black uppercase tracking-widest" style={{ color: 'var(--brand-dark)' }}>
                  Features
                </h2>
                {vehicle.features?.length > 0 && (
                  <FeatureGroup title="All Features" items={vehicle.features} />
                )}
                {vehicle.safetyFeatures && vehicle.safetyFeatures.length > 0 && (
                  <FeatureGroup title="Safety" items={vehicle.safetyFeatures} />
                )}
                {vehicle.comfortFeatures && vehicle.comfortFeatures.length > 0 && (
                  <FeatureGroup title="Comfort" items={vehicle.comfortFeatures} />
                )}
                {vehicle.technologyFeatures && vehicle.technologyFeatures.length > 0 && (
                  <FeatureGroup title="Technology" items={vehicle.technologyFeatures} />
                )}
              </div>
            )}

            {/* Tech highlights */}
            {(vehicle.appleCarPlay || vehicle.androidAuto || vehicle.bluetooth || vehicle.navigationSystem ||
              vehicle.climateControl || vehicle.heatedSeats || vehicle.ventilatedSeats || vehicle.electricSeats ||
              vehicle.keylessEntry || vehicle.pushButtonStart || vehicle.parkingSensors || vehicle.rearCamera ||
              vehicle.surroundCamera || vehicle.adaptiveCruiseControl || vehicle.laneAssist ||
              vehicle.abs || vehicle.tractionControl || vehicle.stabilityControl ||
              vehicle.sunroof || vehicle.panoramicRoof || vehicle.fogLights || vehicle.ledHeadlights ||
              vehicle.alloyWheels || vehicle.turbocharged) && (
                <div className="bg-white shadow-sm p-6">
                  <h2 className="mb-5 text-sm font-black uppercase tracking-widest" style={{ color: 'var(--brand-dark)' }}>
                    Tech &amp; Safety Highlights
                  </h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {([
                      [vehicle.appleCarPlay, 'Apple CarPlay'],
                      [vehicle.androidAuto, 'Android Auto'],
                      [vehicle.bluetooth, 'Bluetooth'],
                      [vehicle.navigationSystem, 'Navigation'],
                      [vehicle.climateControl, 'Climate Control'],
                      [vehicle.heatedSeats, 'Heated Seats'],
                      [vehicle.ventilatedSeats, 'Ventilated Seats'],
                      [vehicle.electricSeats, 'Electric Seats'],
                      [vehicle.keylessEntry, 'Keyless Entry'],
                      [vehicle.pushButtonStart, 'Push-Button Start'],
                      [vehicle.parkingSensors, 'Parking Sensors'],
                      [vehicle.rearCamera, 'Rear Camera'],
                      [vehicle.surroundCamera, '360° Camera'],
                      [vehicle.adaptiveCruiseControl, 'Adaptive Cruise'],
                      [vehicle.laneAssist, 'Lane Assist'],
                      [vehicle.abs, 'ABS'],
                      [vehicle.tractionControl, 'Traction Control'],
                      [vehicle.stabilityControl, 'Stability Control'],
                      [vehicle.sunroof, 'Sunroof'],
                      [vehicle.panoramicRoof, 'Panoramic Roof'],
                      [vehicle.fogLights, 'Fog Lights'],
                      [vehicle.ledHeadlights, 'LED Headlights'],
                      [vehicle.alloyWheels, 'Alloy Wheels'],
                      [vehicle.turbocharged, 'Turbocharged'],
                    ] as [boolean | null | undefined, string][])
                      .filter(([val]) => val)
                      .map(([, label]) => (
                        <div key={label} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="size-4 shrink-0" style={{ color: 'var(--brand-primary)' }} />
                          <span style={{ color: 'var(--brand-text-dark)' }}>{label}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* EV specs */}
            {vehicle.fuelType === 'electric' && (vehicle.batteryCapacityKwh || vehicle.electricRangeKm) && (
              <div className="bg-white shadow-sm p-6">
                <h2 className="mb-5 text-sm font-black uppercase tracking-widest" style={{ color: 'var(--brand-dark)' }}>
                  Electric Vehicle Specs
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                  {vehicle.batteryCapacityKwh && <SpecRow icon={<Zap className="size-4" />} label="Battery" value={`${vehicle.batteryCapacityKwh} kWh`} />}
                  {vehicle.electricRangeKm && <SpecRow icon={<Gauge className="size-4" />} label="Range" value={`${vehicle.electricRangeKm} km`} />}
                  {vehicle.chargingTimeHours && <SpecRow icon={<Zap className="size-4" />} label="Charge Time" value={`${vehicle.chargingTimeHours}h`} />}
                  {vehicle.chargingPortType && <SpecRow icon={<Zap className="size-4" />} label="Port Type" value={vehicle.chargingPortType} />}
                  {vehicle.batteryHealthPercent && <SpecRow icon={<Shield className="size-4" />} label="Battery Health" value={`${vehicle.batteryHealthPercent}%`} />}
                  <BadgePill active={vehicle.fastChargingSupported} label="Fast Charging" />
                </div>
              </div>
            )}

            {/* Commercial specs */}
            {(vehicle.payloadCapacityKg || vehicle.towingCapacityKg || vehicle.grossVehicleWeightKg || vehicle.axleCount) && (
              <div className="bg-white shadow-sm p-6">
                <h2 className="mb-5 text-sm font-black uppercase tracking-widest" style={{ color: 'var(--brand-dark)' }}>
                  Commercial Specs
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                  {vehicle.payloadCapacityKg && <SpecRow icon={<Layers className="size-4" />} label="Payload" value={`${fmtNum(vehicle.payloadCapacityKg)} kg`} />}
                  {vehicle.towingCapacityKg && <SpecRow icon={<Layers className="size-4" />} label="Towing" value={`${fmtNum(vehicle.towingCapacityKg)} kg`} />}
                  {vehicle.grossVehicleWeightKg && <SpecRow icon={<Layers className="size-4" />} label="GVW" value={`${fmtNum(vehicle.grossVehicleWeightKg)} kg`} />}
                  {vehicle.axleCount && <SpecRow icon={<Settings2 className="size-4" />} label="Axles" value={String(vehicle.axleCount)} />}
                  {vehicle.wheelConfiguration && <SpecRow icon={<Settings2 className="size-4" />} label="Wheels" value={vehicle.wheelConfiguration} />}
                  {vehicle.bedLength && <SpecRow icon={<Layers className="size-4" />} label="Bed Length" value={vehicle.bedLength} />}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: price + contact ── */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">

            {/* Price card */}
            <div className="bg-white shadow-sm p-6">
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span
                  className="inline-block px-3 py-1 text-[11px] font-black uppercase text-white"
                  style={{ backgroundColor: status.color }}
                >
                  {status.label}
                </span>
                {vehicle.featured && (
                  <span
                    className="inline-block px-3 py-1 text-[11px] font-black uppercase text-white"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    ★ Featured
                  </span>
                )}
                {vehicle.promoted && (
                  <span className="inline-block px-3 py-1 text-[11px] font-black uppercase bg-amber-500 text-white">
                    Promoted
                  </span>
                )}
              </div>

              <h1 className="text-xl font-black uppercase leading-tight mb-2" style={{ color: 'var(--brand-dark)' }}>
                {vehicle.title}
              </h1>
              <p className="text-sm mb-4" style={{ color: 'var(--brand-text-dark)', opacity: 0.65 }}>
                {vehicle.year} {vehicle.make} {vehicle.model}{vehicle.trim ? ` ${vehicle.trim}` : ''}
              </p>

              <div className="border-t pt-4" style={{ borderColor: 'var(--brand-light-bg-secondary)' }}>
                <p className="text-3xl font-black" style={{ color: 'var(--brand-primary)' }}>
                  {vehicle.currency} {vehicle.price.toLocaleString()}
                </p>
                {vehicle.negotiable && (
                  <p className="mt-1 text-xs font-bold" style={{ color: 'var(--brand-primary)', opacity: 0.8 }}>
                    Price is negotiable
                  </p>
                )}
                {vehicle.financingAvailable && (
                  <p className="mt-1 text-xs font-semibold text-green-600">✓ Financing available</p>
                )}
              </div>

              {/* Quick stats strip */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="p-2" style={{ backgroundColor: 'var(--brand-light-bg)' }}>
                  <p className="text-[10px] font-bold uppercase opacity-60" style={{ color: 'var(--brand-text-dark)' }}>Year</p>
                  <p className="text-sm font-black" style={{ color: 'var(--brand-dark)' }}>{vehicle.year}</p>
                </div>
                <div className="p-2" style={{ backgroundColor: 'var(--brand-light-bg)' }}>
                  <p className="text-[10px] font-bold uppercase opacity-60" style={{ color: 'var(--brand-text-dark)' }}>KM</p>
                  <p className="text-sm font-black" style={{ color: 'var(--brand-dark)' }}>{fmtNum(vehicle.mileage)}</p>
                </div>
                <div className="p-2 text-white" style={{ backgroundColor: condition.color }}>
                  <p className="text-[10px] font-bold uppercase opacity-80">Cond.</p>
                  <p className="text-[11px] font-black leading-tight">{condition.label}</p>
                </div>
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-white shadow-sm p-6">
              <h2 className="mb-4 text-sm font-black uppercase" style={{ color: 'var(--brand-dark)' }}>
                Contact Seller
              </h2>

              {vehicle.sellerContactName && (
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--brand-text-dark)' }}>
                  <BadgeCheck className="size-4 shrink-0" style={{ color: 'var(--brand-primary)' }} />
                  {vehicle.sellerContactName}
                </p>
              )}

              <div className="space-y-2">
                {vehicle.sellerContactPhone && (
                  <a
                    href={`tel:${vehicle.sellerContactPhone}`}
                    className="flex items-center gap-3 p-3 border transition hover:bg-black/5"
                    style={{ borderColor: 'var(--brand-light-bg-secondary)' }}
                  >
                    <Phone className="size-4 shrink-0" style={{ color: 'var(--brand-primary)' }} />
                    <span className="text-sm font-semibold">{vehicle.sellerContactPhone}</span>
                  </a>
                )}

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 text-white transition hover:opacity-90"
                    style={{ backgroundColor: '#25d366' }}
                  >
                    <MessageCircle className="size-4 shrink-0" />
                    <span className="text-sm font-bold">Chat on WhatsApp</span>
                  </a>
                )}

                {vehicle.sellerContactEmail && (
                  <a
                    href={`mailto:${vehicle.sellerContactEmail}`}
                    className="flex items-center gap-3 p-3 border transition hover:bg-black/5"
                    style={{ borderColor: 'var(--brand-light-bg-secondary)' }}
                  >
                    <Mail className="size-4 shrink-0" style={{ color: 'var(--brand-primary)' }} />
                    <span className="text-sm font-semibold truncate">{vehicle.sellerContactEmail}</span>
                  </a>
                )}
              </div>

              <a
                href={vehicle.sellerContactPhone ? `tel:${vehicle.sellerContactPhone}` : '#'}
                className="mt-4 flex w-full items-center justify-center gap-2 p-3 text-sm font-black uppercase text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                <Phone className="size-4" />
                Make an Enquiry
              </a>
            </div>

            {/* Location */}
            <div className="bg-white shadow-sm p-5">
              <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--brand-text-dark)' }}>
                <MapPin className="size-4 shrink-0" style={{ color: 'var(--brand-primary)' }} />
                {[vehicle.address, vehicle.city, vehicle.stateOrCounty, vehicle.country].filter(Boolean).join(', ')}
              </p>
            </div>

            {/* Listing meta */}
            <div
              className="bg-white shadow-sm p-5 text-xs space-y-1.5"
              style={{ color: 'var(--brand-text-dark)' }}
            >
              {vehicle.viewsCount != null && (
                <p className="opacity-65">👁 {fmtNum(vehicle.viewsCount)} views</p>
              )}
              {vehicle.createdAt && (
                <p className="opacity-65">
                  Listed {new Date(vehicle.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
              {vehicle.vinOrChassisNumber && (
                <p className="opacity-65">Chassis: {vehicle.vinOrChassisNumber}</p>
              )}
              {vehicle.registrationNumber && (
                <p className="opacity-65">Reg: {vehicle.registrationNumber}</p>
              )}
              {vehicle.stockNumber && (
                <p className="opacity-65">Stock #: {vehicle.stockNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Related vehicles ── */}
        {related && related.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black uppercase" style={{ color: 'var(--brand-dark)' }}>
                Similar Vehicles
              </h2>
              <Link
                href="/vehicles"
                className="text-xs font-bold uppercase transition hover:opacity-70"
                style={{ color: 'var(--brand-primary)' }}
              >
                View all →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((v) => (
                <RelatedCard key={v._id} vehicle={v} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>

      <Footer />
    </>
  )
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SpecRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | null | undefined
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 opacity-40" style={{ color: 'var(--brand-dark)' }}>
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-50" style={{ color: 'var(--brand-text-dark)' }}>
          {label}
        </p>
        <p className="text-sm font-semibold" style={{ color: 'var(--brand-dark)' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

function BadgePill({ active, label }: { active?: boolean | null; label: string }) {
  if (active == null) return null
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
      style={{
        backgroundColor: active ? 'rgba(215,25,32,0.08)' : 'var(--brand-light-bg-secondary)',
        color: active ? 'var(--brand-primary)' : 'var(--brand-text-dark)',
        opacity: active ? 1 : 0.55,
      }}
    >
      <CheckCircle2 className="size-3.5 shrink-0" />
      {label}
    </div>
  )
}

function FeatureGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-[10px] font-black uppercase tracking-widest opacity-50" style={{ color: 'var(--brand-text-dark)' }}>
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((f, i) => (
          <span
            key={i}
            className="px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: 'var(--brand-light-bg-secondary)',
              color: 'var(--brand-text-dark)',
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

type RelatedVehicle = {
  _id: string
  title: string
  make: string
  model: string
  year: number
  price: number
  currency: string
  mileage: number
  mileageUnit: string
  condition: string
  thumbnailUrl?: string | null
  images?: string[]
  slug?: string | null
  city: string
  country: string
}

function RelatedCard({ vehicle }: { vehicle: RelatedVehicle }) {
  const href = `/vehicles/${vehicle.slug || vehicle._id}`
  const img = vehicle.thumbnailUrl ?? vehicle.images?.[0] ?? null

  return (
    <Link
      href={href}
      className="group block overflow-hidden bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[1.5] overflow-hidden bg-gray-100">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={vehicle.title}
            className="size-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="size-full flex items-center justify-center">
            <Car className="size-10 text-gray-300" />
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-bold truncate" style={{ color: 'var(--brand-dark)' }}>{vehicle.title}</p>
        <p className="mt-1 text-xs opacity-60" style={{ color: 'var(--brand-text-dark)' }}>
          {vehicle.year} · {vehicle.mileage.toLocaleString()} {vehicle.mileageUnit}
        </p>
        <p className="mt-2 text-sm font-black" style={{ color: 'var(--brand-primary)' }}>
          {vehicle.currency} {vehicle.price.toLocaleString()}
        </p>
      </div>
    </Link>
  )
}
