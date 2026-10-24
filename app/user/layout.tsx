import { AppSidebarUser } from "@/components/app-sidebar-user"
import { SiteHeaderUser } from "@/components/site-header-user"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"


export default async function UserLayout({ children }: { children: React.ReactNode }) {
    const user = await currentUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider>
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 64)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as React.CSSProperties
                    }
                >
                    <AppSidebarUser variant="inset" />
                    <SidebarInset>
                        <SiteHeaderUser />
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </TooltipProvider>
        </ThemeProvider>
    )
}
