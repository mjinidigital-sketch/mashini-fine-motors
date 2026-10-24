"use client"

import * as React from "react"
import Link from "next/link"

import { NavDocuments } from "@/components/nav-documents"
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
import { DashboardSquare01Icon, Menu01Icon, ChartHistogramIcon, Folder01Icon, UserGroupIcon, Camera01Icon, File01Icon, Settings05Icon, HelpCircleIcon, SearchIcon, Database01Icon, Analytics01Icon, CommandIcon } from "@hugeicons/core-free-icons"
import { Car, CircleGauge } from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: (
        <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: (
        <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Vehicles",
      url: "/admin/vehicles",
      icon: (
        <Car className="size-4" />
      ),
    },
    {
      title: "Insurance",
      url: "/admin/insurance",
      icon: (
        <HugeiconsIcon icon={ChartHistogramIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Inquiries",
      url: "/admin/inquiries",
      icon: (
        <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} />
      ),
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: (
        <HugeiconsIcon icon={Camera01Icon} strokeWidth={2} />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: (
        <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: (
        <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
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
    {
      title: "Search",
      url: "#",
      icon: (
        <HugeiconsIcon icon={SearchIcon} strokeWidth={2} />
      ),
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Database01Icon} strokeWidth={2} />
      ),
    },
    {
      name: "Reports",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />
      ),
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: (
        <HugeiconsIcon icon={File01Icon} strokeWidth={2} />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
