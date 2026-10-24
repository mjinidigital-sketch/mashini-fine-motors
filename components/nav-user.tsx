"use client"

import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MoreVerticalCircle01Icon,
  UserCircle02Icon,
  CreditCardIcon,
  Notification03Icon,
  Logout01Icon,
  Login01Icon,
  UserAdd01Icon,
  Shield01Icon,
  DashboardSquare01Icon,
  Settings05Icon,
} from "@hugeicons/core-free-icons"
import { Car, LayoutDashboard, ShieldCheck, Mail } from "lucide-react"
import { useClerk, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { cn } from "cn"

const SESSION_STORAGE_KEY = "ridepoa_nav_user_session_v1"
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds

interface CachedUserSession {
  isSignedIn: boolean
  id?: string
  name: string
  email: string
  avatar: string
  role?: string
  timestamp: number
}

interface NavUserProps {
  user?: {
    name: string
    email: string
    avatar: string
  }
  variant?: "sidebar" | "header" | "mobile"
  className?: string
}

export function NavUser({
  user: propUser,
  variant = "sidebar",
  className,
}: NavUserProps) {
  // Use useSidebar safely if in sidebar, otherwise fallback
  let isMobile = false
  try {
    const sidebar = useSidebar()
    isMobile = sidebar.isMobile
  } catch {
    isMobile = false
  }

  const { user: clerkUser, isLoaded, isSignedIn } = useUser()
  const { signOut, openUserProfile } = useClerk()

  // Local storage cached session (valid for 1 week)
  const [cachedSession, setCachedSession] = React.useState<CachedUserSession | null>(null)

  // 1. Instantly restore cached session from localStorage on initial render
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CachedUserSession
        const age = Date.now() - (parsed.timestamp || 0)
        if (age < ONE_WEEK_MS && parsed.isSignedIn) {
          setCachedSession(parsed)
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // 2. Background refresh: When Clerk finishes loading or updates, refresh localStorage cache
  React.useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && clerkUser) {
      const freshName =
        clerkUser.fullName ||
        clerkUser.username ||
        (clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : propUser?.name || "User")
      const freshEmail =
        clerkUser.primaryEmailAddress?.emailAddress || propUser?.email || ""
      const freshAvatar = clerkUser.imageUrl || propUser?.avatar || ""

      const role = (
        (clerkUser.publicMetadata as Record<string, any>)?.role ||
        (clerkUser.unsafeMetadata as Record<string, any>)?.role ||
        "user"
      ) as string

      const updatedSession: CachedUserSession = {
        isSignedIn: true,
        id: clerkUser.id,
        name: freshName,
        email: freshEmail,
        avatar: freshAvatar,
        role,
        timestamp: Date.now(),
      }

      setCachedSession(updatedSession)
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession))
      } catch {
        // ignore
      }
    } else if (isSignedIn === false) {
      setCachedSession(null)
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY)
      } catch {
        // ignore
      }
    }
  }, [isLoaded, isSignedIn, clerkUser, propUser?.name, propUser?.email, propUser?.avatar])

  // Derive active values: live Clerk data if loaded, otherwise fallback to 1-week cached session
  const effectiveIsSignedIn = isLoaded
    ? Boolean(isSignedIn)
    : Boolean(cachedSession?.isSignedIn ?? isSignedIn)

  const currentUserId = isLoaded
    ? clerkUser?.id || ""
    : cachedSession?.id || ""

  const userRole = (
    (clerkUser?.publicMetadata as Record<string, any>)?.role ||
    (clerkUser?.unsafeMetadata as Record<string, any>)?.role ||
    cachedSession?.role ||
    "user"
  ).toLowerCase()

  const name = React.useMemo(() => {
    if (isLoaded) {
      return (
        clerkUser?.fullName ||
        clerkUser?.username ||
        (clerkUser?.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : propUser?.name || (effectiveIsSignedIn ? "User" : "Guest"))
      )
    }
    return cachedSession?.name || propUser?.name || (effectiveIsSignedIn ? "User" : "Guest")
  }, [isLoaded, clerkUser, propUser?.name, effectiveIsSignedIn, cachedSession?.name])

  const email = React.useMemo(() => {
    if (isLoaded) {
      return (
        clerkUser?.primaryEmailAddress?.emailAddress ||
        propUser?.email ||
        (effectiveIsSignedIn ? "" : "Not signed in")
      )
    }
    return cachedSession?.email || propUser?.email || (effectiveIsSignedIn ? "" : "Not signed in")
  }, [isLoaded, clerkUser?.primaryEmailAddress?.emailAddress, propUser?.email, effectiveIsSignedIn, cachedSession?.email])

  const avatar = React.useMemo(() => {
    if (isLoaded) {
      return clerkUser?.imageUrl || propUser?.avatar || ""
    }
    return cachedSession?.avatar || propUser?.avatar || ""
  }, [isLoaded, clerkUser?.imageUrl, propUser?.avatar, cachedSession?.avatar])

  const initials = React.useMemo(() => {
    return (
      (isLoaded ? clerkUser?.firstName?.[0] || clerkUser?.username?.[0] : null) ||
      cachedSession?.name?.[0] ||
      name?.[0] ||
      "U"
    ).toUpperCase()
  }, [isLoaded, clerkUser?.firstName, clerkUser?.username, cachedSession?.name, name])

  const handleSignOut = React.useCallback(async () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // ignore
    }
    setCachedSession(null)
    await signOut({ redirectUrl: "/" })
  }, [signOut])

  const handleOpenAccount = React.useCallback(() => {
    openUserProfile?.()
  }, [openUserProfile])

  const userDashboardUrl = "/user"

  // Content shown in the dropdown menu
  const dropdownContent = effectiveIsSignedIn ? (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel className="p-0 font-normal">
          <Link
            href={userDashboardUrl}
            className="flex items-center gap-2.5 px-2 py-2 text-left text-sm hover:bg-muted/60 rounded-lg transition-colors group cursor-pointer"
          >
            <Avatar className="size-9 rounded-lg border border-border shrink-0">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                  {name}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary capitalize shrink-0">
                  {userRole}
                </span>
              </div>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
          </Link>
        </DropdownMenuLabel>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {/* User Dashboard */}
        <Link href={userDashboardUrl} className="block w-full">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-2.5 py-2 font-medium hover:bg-primary hover:text-white"
          >
            <LayoutDashboard className="size-4 text-primary group-hover:text-white" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>

        {/* My Profile */}
        <Link href="/user?tab=overview" className="block w-full">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-2.5 py-2 hover:bg-primary hover:text-white"
          >
            <HugeiconsIcon icon={UserCircle02Icon} strokeWidth={2} className="size-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
        </Link>

        {/* My Listed Cars */}
        <Link href="/user?tab=cars" className="block w-full">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-2.5 py-2 hover:bg-primary hover:text-white"
          >
            <Car className="size-4" />
            <span>My Vehicles</span>
          </DropdownMenuItem>
        </Link>

        {/* My Insurance Policies */}
        <Link href="/user?tab=insurance" className="block w-full">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-2.5 py-2 hover:bg-primary hover:text-white"
          >
            <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} className="size-4 text-emerald-500" />
            <span>Insurance Policies</span>
          </DropdownMenuItem>
        </Link>

        {/* Inquiries & Offers */}
        <Link href="/user?tab=inquiries" className="block w-full">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-2.5 py-2 hover:bg-primary hover:text-white"
          >
            <HugeiconsIcon icon={Notification03Icon} strokeWidth={2} className="size-4" />
            <span>Inquiries & Offers</span>
          </DropdownMenuItem>
        </Link>

        {/* If Admin, also show Admin Dashboard link */}
        {userRole === "admin" && (
          <>
            <DropdownMenuSeparator />
            <Link href="/admin" className="block w-full">
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 px-2.5 py-2 font-medium hover:bg-red-500 hover:text-white"
              >
                <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} className="size-4 text-red-500" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleOpenAccount}
          className="cursor-pointer gap-2.5 px-2.5 py-2 hover:bg-primary hover:text-white"
        >
          <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} className="size-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={handleSignOut}
        variant="destructive"
        className="cursor-pointer gap-2.5 px-2.5 py-2 text-destructive hover:bg-destructive/10 font-medium"
      >
        <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} className="size-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </>
  ) : (
    <>
      <DropdownMenuGroup>
        <Link href="/login" className="w-full block">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-2.5 py-2 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground transition-colors"
          >
            <HugeiconsIcon icon={Login01Icon} strokeWidth={2} className="size-4" />
            <span>Sign In</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/signup" className="w-full block">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-2.5 py-2 hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground transition-colors"
          >
            <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-4" />
            <span>Create Account</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
    </>
  )

  // Header Variant
  if (variant === "header") {
    return (
      <div className={cn("flex items-center", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="group flex items-center gap-2 rounded-full p-1 sm:pr-3 text-left transition-colors hover:bg-muted cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary border border-transparent hover:border-border"
              />
            }
          >
            <Avatar className="size-8 rounded-full border border-border shadow-xs">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback suppressHydrationWarning className="rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                {effectiveIsSignedIn ? initials : <HugeiconsIcon icon={UserCircle02Icon} strokeWidth={2} className="size-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:grid text-left leading-tight max-w-[120px]">
              <span suppressHydrationWarning className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </span>
              <span suppressHydrationWarning className="truncate text-[10px] text-muted-foreground">{email}</span>
            </div>
            <HugeiconsIcon
              icon={MoreVerticalCircle01Icon}
              strokeWidth={2}
              className="hidden sm:block ml-0.5 size-4 text-muted-foreground group-hover:text-foreground transition-colors"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-60 rounded-xl shadow-xl border border-border p-1.5"
            side="bottom"
            align="end"
            sideOffset={8}
          >
            {dropdownContent}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Mobile Variant
  if (variant === "mobile") {
    if (!effectiveIsSignedIn) {
      return (
        <div className={cn("flex flex-col gap-2.5 w-full", className)}>
          <Link href="/login" className="w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-center gap-2 border-border font-semibold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <HugeiconsIcon icon={Login01Icon} strokeWidth={2} className="size-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button
              variant="default"
              size="lg"
              className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm cursor-pointer shadow-sm transition-colors"
            >
              <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} className="size-4" />
              Get Started
            </Button>
          </Link>
        </div>
      )
    }

    return (
      <div className={cn("flex items-center w-full", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted/80 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary border border-border bg-muted/40"
              />
            }
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-9 rounded-lg border border-border shadow-xs shrink-0">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback suppressHydrationWarning className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid text-left leading-tight min-w-0">
                <span suppressHydrationWarning className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {name}
                </span>
                <span suppressHydrationWarning className="truncate text-xs text-muted-foreground">{email}</span>
              </div>
            </div>
            <HugeiconsIcon
              icon={MoreVerticalCircle01Icon}
              strokeWidth={2}
              className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-60 rounded-xl shadow-xl border border-border p-1.5"
            side="bottom"
            align="start"
            sideOffset={6}
          >
            {dropdownContent}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Sidebar Variant
  return (
    <SidebarMenu className={className}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
              />
            }
          >
            <Avatar className="size-8 rounded-lg border border-border">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-foreground">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
            <HugeiconsIcon
              icon={MoreVerticalCircle01Icon}
              strokeWidth={2}
              className="ml-auto size-4 text-muted-foreground"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-60 rounded-xl shadow-xl border border-border p-1.5"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            {dropdownContent}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
