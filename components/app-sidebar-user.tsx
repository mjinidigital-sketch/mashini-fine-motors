"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon, UserCircle02Icon, CarIcon, Shield01Icon, MessageSquareIcon, Settings05Icon, HelpCircleIcon } from "@hugeicons/core-free-icons"
import { Car, CircleGauge, LayoutDashboard, User, ShieldCheck, MessageSquare } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/user",
      icon: (
        <LayoutDashboard className="size-4" />
      ),
    },
    {
      title: "My Profile",
      url: "/user?tab=overview",
      icon: (
        <User className="size-4" />
      ),
    },
    {
      title: "My Vehicles",
      url: "/user?tab=cars",
      icon: (
        <Car className="size-4" />
      ),
    },
    {
      title: "Insurance",
      url: "/user?tab=insurance",
      icon: (
        <ShieldCheck className="size-4" />
      ),
    },
    {
      title: "Inquiries",
      url: "/user?tab=inquiries",
      icon: (
        <MessageSquare className="size-4" />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
      ),
    },
  ],
}

export function AppSidebarUser({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  const userRole = (
    (user?.publicMetadata as Record<string, any>)?.role ||
    (user?.unsafeMetadata as Record<string, any>)?.role ||
    "user"
  ).toLowerCase()

  // Add admin dashboard link if user is admin
  const navMainItems = [...data.navMain]
  if (userRole === "admin") {
    navMainItems.push({
      title: "Admin Dashboard",
      url: "/admin",
      icon: (
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-4 text-red-500" />
      ),
    })
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/"
              aria-label="Mashini Fine Motors home"
              className="group inline-flex items-center gap-2.5 z-5"
            >
              <span
                className="relative flex flex-col pt-2"
                style={{ color: "var(--brand-text-dark)" }}
              >
                <span
                  className="absolute left-0 top-0 h-1 w-12 -rotate-6 rounded-full transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />

                <span className="flex items-baseline gap-x-1 text-xl font-black leading-none ">
                  <span className="dark:text-white">Mashini</span>
                  <span style={{ color: "var(--brand-primary)" }}>Fine</span>
                </span>

                <span className="mt-1 flex items-center gap-1.5 dark:text-white">
                  <span className="text-xs font-semibold leading-none tracking-[0.24em]">
                    MOTORS
                  </span>
                  <CircleGauge
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0 transition-transform duration-300 group-hover:rotate-12"
                    style={{ color: "var(--brand-primary)" }}
                    aria-hidden="true"
                  />
                </span>
              </span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser variant="sidebar" />
      </SidebarFooter>
    </Sidebar>
  )
}
