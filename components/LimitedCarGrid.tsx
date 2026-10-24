import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import CarCard from './page/CarCard'
import Link from 'next/link'

const MAX_VEHICLES = 24

export default async function LimitedCarGrid() {
    const vehicles = await fetchQuery(api.vehicles.listActive, {})
    const limitedVehicles = vehicles.slice(0, MAX_VEHICLES)

    if (!limitedVehicles || limitedVehicles.length === 0) {
        return null
    }

    return (
        <section className="mt-20 py-20" style={{ backgroundColor: 'var(--brand-light-bg)' }}>
            <div className="container mx-auto px-4 md:px-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2
                            className="text-3xl font-black uppercase"
                            style={{ color: 'var(--brand-dark)' }}
                        >
                            Available Vehicles
                        </h2>
                        <p
                            className="mt-2 text-sm"
                            style={{ color: 'var(--brand-text-dark)', opacity: 0.7 }}
                        >
                            Browse our extensive inventory
                        </p>
                    </div>
                    <Link
                        href="/vehicles"
                        className="px-6 py-3 text-sm font-bold uppercase text-white transition hover:opacity-90"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                        View All
                    </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {limitedVehicles.map((vehicle) => (
                        <CarCard key={vehicle._id} vehicle={vehicle} />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/vehicles"
                        className="inline-block px-8 py-3 text-sm font-bold uppercase text-white transition-all hover:opacity-90 hover:shadow-lg"
                        style={{ backgroundColor: 'var(--brand-primary)' }}
                    >
                        See More Cars
                    </Link>
                </div>
            </div>
        </section>
    )
}
