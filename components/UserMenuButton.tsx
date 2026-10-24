"use client"

import * as React from "react"
import Link from "next/link"
import { User, Car, ShieldCheck, MessageSquare, Settings, LogOut, LayoutDashboard, ChevronDown } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserMenuButton() {
  const { user } = useUser()

  const userName = user?.fullName || user?.username || "User"
  const userEmail = user?.primaryEmailAddress?.emailAddress || ""
  const userAvatar = user?.imageUrl || ""
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const userRole = (
    (user?.publicMetadata as Record<string, any>)?.role ||
    (user?.unsafeMetadata as Record<string, any>)?.role ||
    "user"
  ).toLowerCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-between gap-2 h-10 px-4 rounded-none border border-border bg-background/50 hover:bg-background hover:border-primary/30 hover:shadow-sm transition-all duration-200 text-sm font-semibold cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Avatar className="size-6 rounded-full border border-border/50">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-flex">{userName}</span>
          </div>
          <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-xl border-border/50 shadow-xl"
        align="end"
        sideOffset={8}
      >
        {/* User Info */}
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="size-10 rounded-lg border border-border/50">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary capitalize">
                {userRole}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Navigation Links */}
        <Link href="/user" className="block w-full">
          <DropdownMenuItem className="cursor-pointer gap-2 py-2 hover:bg-accent/50 transition-colors">
            <LayoutDashboard className="size-4 text-primary" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/user?tab=overview" className="block w-full">
          <DropdownMenuItem className="cursor-pointer gap-2 py-2 hover:bg-accent/50 transition-colors">
            <User className="size-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/user?tab=cars" className="block w-full">
          <DropdownMenuItem className="cursor-pointer gap-2 py-2 hover:bg-accent/50 transition-colors">
            <Car className="size-4" />
            <span>My Vehicles</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/user?tab=insurance" className="block w-full">
          <DropdownMenuItem className="cursor-pointer gap-2 py-2 hover:bg-accent/50 transition-colors">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Insurance</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/user?tab=inquiries" className="block w-full">
          <DropdownMenuItem className="cursor-pointer gap-2 py-2 hover:bg-accent/50 transition-colors">
            <MessageSquare className="size-4" />
            <span>Inquiries</span>
          </DropdownMenuItem>
        </Link>

        {userRole === "admin" && (
          <>
            <DropdownMenuSeparator />
            <Link href="/admin" className="block w-full">
              <DropdownMenuItem className="cursor-pointer gap-2 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                <LayoutDashboard className="size-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Account Settings */}
        <DropdownMenuItem className="cursor-pointer gap-2 py-2 hover:bg-accent/50 transition-colors">
          <Settings className="size-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Log Out */}
        <UserButton>
          <DropdownMenuItem className="cursor-pointer gap-2 py-2 text-destructive hover:bg-destructive/10 focus:text-destructive transition-colors">
            <LogOut className="size-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </UserButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
