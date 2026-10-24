'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowUpRight,
  CarFront,
  ChevronDown,
  CircleGauge,
  Menu,
  Phone,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Authenticated, Unauthenticated } from 'convex/react'
import { Button } from '../ui/button'
import { UserMenuButton } from '../UserMenuButton'

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Explore Cars', href: '/vehicles' },

  { label: 'Insurance', href: '/insurance' },
  { label: 'Contact', href: '/contact' },
]

const shopLinks = [
  { label: 'All Vehicles', href: '/vehicles', icon: CarFront },
  { label: 'Insurance', href: '/insurance', icon: ShieldCheck },
]

export default function Header() {
  const pathname = usePathname()

  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopShopOpen, setDesktopShopOpen] = useState(false)
  const [mobileShopOpen, setMobileShopOpen] = useState(false)

  const closeMenus = () => {
    setMenuOpen(false)
    setDesktopShopOpen(false)
    setMobileShopOpen(false)
  }

  // Match the current route, including nested pages.
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isShopActive = shopLinks.some((item) => isActive(item.href))

  const desktopLinkClass = (href: string) =>
    `relative flex h-full items-center py-7 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-200 ${isActive(href)
      ? 'text-[var(--brand-primary)] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[var(--brand-primary)]'
      : 'text-gray-600 hover:text-[var(--brand-primary)]'
    }`

  const mobileLinkClass = (href: string) =>
    `relative flex items-center justify-between rounded-lg px-4 py-3.5 text-sm font-semibold transition-colors ${isActive(href)
      ? 'bg-[var(--brand-primary)]/[0.06] text-[var(--brand-primary)] before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-[var(--brand-primary)]'
      : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-primary)]'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <Link
          href="/"
          aria-label="Mashini Fine Motors home"
          onClick={closeMenus}
          className="group flex shrink-0 items-center"
        >
          <span
            className="relative flex flex-col pt-2"
            style={{ color: 'var(--brand-text-dark)' }}
          >
            <span
              className="absolute left-0 top-0 h-1 w-10 -rotate-6 rounded-full transition-all duration-300 group-hover:w-14"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            />

            <span className="flex items-baseline gap-1 text-xl font-black leading-none tracking-[-0.065em] sm:text-2xl">
              <span>Mashini</span>
              <span style={{ color: 'var(--brand-primary)' }}>
                Fine
              </span>
            </span>

            <span className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[10px] font-bold leading-none tracking-[0.28em] sm:text-xs">
                MOTORS
              </span>

              <CircleGauge
                size={16}
                strokeWidth={2.5}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:rotate-12"
                style={{ color: 'var(--brand-primary)' }}
              />
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden h-[76px] items-center gap-5 lg:flex xl:gap-7"
        >
          {navigation.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={desktopLinkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}


          {navigation.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={desktopLinkClass(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Authentication and actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Authenticated>
            <UserMenuButton />
          </Authenticated>

          <Unauthenticated>
            <div className="hidden items-center gap-2 sm:flex">
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="h-10 px-3 text-xs font-semibold text-brand-primary border-2 border-brand-primary hover:border-brand-primary/75 hover:text-blue-500"
                >
                  Login
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button
                  className="h-10 rounded-none px-4 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </Unauthenticated>

          <Link
            href="/user"
            className="bg-black hidden items-center gap-2 rounded-none px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md lg:inline-flex xl:px-5"

          >
            Sell a Car
            <ArrowUpRight size={14} />
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-gray-200 text-gray-800 transition-colors hover:bg-gray-50 lg:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out lg:hidden ${menuOpen
          ? 'grid-rows-[1fr] border-t border-gray-100 opacity-100'
          : 'pointer-events-none grid-rows-[0fr] opacity-0'
          }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav
          aria-label="Mobile navigation"
          className="min-h-0 overflow-hidden"
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {navigation.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={closeMenus}
                tabIndex={menuOpen ? 0 : -1}
                className={mobileLinkClass(item.href)}
              >
                {item.label}

                <ArrowUpRight
                  size={16}
                  className={
                    isActive(item.href)
                      ? 'text-[var(--brand-primary)]'
                      : 'text-gray-400'
                  }
                />
              </Link>
            ))}

            {/* Mobile shop dropdown */}
            <div>
              <button
                type="button"
                onClick={() => setMobileShopOpen((open) => !open)}
                aria-expanded={mobileShopOpen}
                aria-controls="mobile-shop-menu"
                className={`relative flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-sm font-semibold transition-colors ${isShopActive
                  ? 'bg-[var(--brand-primary)]/[0.06] text-[var(--brand-primary)] before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-[var(--brand-primary)]'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[var(--brand-primary)]'
                  }`}
              >
                Shop by type

                <ChevronDown
                  size={17}
                  className={`transition-transform duration-200 ${mobileShopOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {mobileShopOpen && (
                <div
                  id="mobile-shop-menu"
                  className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3"
                >
                  {shopLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={
                        isActive(item.href) ? 'page' : undefined
                      }
                      onClick={closeMenus}
                      tabIndex={menuOpen ? 0 : -1}
                      className={`flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium transition-colors ${isActive(item.href)
                        ? 'text-[var(--brand-primary)]'
                        : 'text-gray-500 hover:text-[var(--brand-primary)]'
                        }`}
                    >
                      {item.label}

                      {isActive(item.href) && (
                        <span
                          className="size-1.5 rounded-full"
                          style={{
                            backgroundColor: 'var(--brand-primary)',
                          }}
                        />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navigation.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={closeMenus}
                tabIndex={menuOpen ? 0 : -1}
                className={mobileLinkClass(item.href)}
              >
                {item.label}

                <ArrowUpRight
                  size={16}
                  className={
                    isActive(item.href)
                      ? 'text-[var(--brand-primary)]'
                      : 'text-gray-400'
                  }
                />
              </Link>
            ))}

            {/* Mobile sell action */}
            <Link
              href="/contact"
              onClick={closeMenus}
              tabIndex={menuOpen ? 0 : -1}
              className="mt-3 flex items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              <Phone size={16} />
              Sell a Car
            </Link>

            {/* Mobile authentication */}
            <Authenticated>
              <div className="mt-3">
                <UserMenuButton />
              </div>
            </Authenticated>

            <Unauthenticated>
              <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 sm:hidden">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <Button
                    className="w-full text-white"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </Unauthenticated>
          </div>
        </nav>
      </div>
    </header>
  )
}