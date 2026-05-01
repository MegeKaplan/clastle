"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ShieldCheck, UserRoundCheck, Users } from "lucide-react";

import RouteGuard from "@/components/RouteGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarBackdrop,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/approvals", label: "Approvals", icon: UserRoundCheck },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <RouteGuard requireAdmin>
      <SidebarProvider>
        <SidebarBackdrop />
        <Sidebar className="group">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-sidebar-primary/15 text-sidebar-primary">
                <ShieldCheck className="size-4" />
              </span>
              <div className="leading-tight hidden md:block group-data-[collapsed=true]:hidden">
                <div className="text-sm font-semibold text-sidebar-foreground">Admin</div>
                <div className="text-xs text-sidebar-foreground/70">Control center</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <Link href={href} className="block">
                    <SidebarMenuButton isActive={pathname === href}>
                      <Icon className="size-4" />
                      <span className="truncate">{label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-background">
          <div className="sticky top-0 z-20 border-b bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
                  <p className="text-xs text-muted-foreground">Manage users and approvals.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="gap-2">
                  <Link href="/home">
                    <ArrowLeft className="size-4" />
                    Back to app
                  </Link>
                </Button>
                <Badge variant="secondary">Admin</Badge>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
};

export default AdminLayout;
