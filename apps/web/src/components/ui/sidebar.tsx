"use client";

import * as React from "react";
import { PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarContextValue = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

const SidebarProvider = ({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(max-width: 1023px)");

    const syncCollapse = () => {
      if (media.matches) {
        setCollapsed(true);
        setMobileOpen(false);
      }
    };

    syncCollapse();
    media.addEventListener("change", syncCollapse);

    return () => media.removeEventListener("change", syncCollapse);
  }, []);

  const value = React.useMemo(
    () => ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }),
    [collapsed, mobileOpen]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

const Sidebar = ({ className, ...props }: React.ComponentProps<"aside">) => {
  const { collapsed, mobileOpen } = useSidebar();

  return (
    <aside
      data-collapsed={collapsed}
      data-slot="sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 md:translate-x-0",
        "-translate-x-full md:z-20",
        mobileOpen && "translate-x-0",
        collapsed && "md:w-16",
        className
      )}
      {...props}
    />
  );
};

const SidebarBackdrop = ({ className }: { className?: string }) => {
  const { mobileOpen, setMobileOpen } = useSidebar();

  if (!mobileOpen) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Close sidebar"
      className={cn(
        "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden",
        className
      )}
      onClick={() => setMobileOpen(false)}
    />
  );
};

const SidebarHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex items-center justify-between px-4 py-4", className)} {...props} />
);

const SidebarContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("flex-1 px-2 pb-4", className)} {...props} />
);

const SidebarFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("px-4 pb-4", className)} {...props} />
);

const SidebarInset = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        "min-h-screen w-full overflow-x-hidden transition-all duration-200",
        collapsed ? "md:pl-16" : "md:pl-64",
        className
      )}
      {...props}
    />
  );
};

const SidebarMenu = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("space-y-1", className)} {...props} />
);

const SidebarMenuItem = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("px-2", className)} {...props} />
);

const SidebarMenuButton = ({
  className,
  isActive,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean }) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    size="sm"
    className={cn("h-10 w-full justify-start gap-2", className)}
    {...props}
  />
);

const SidebarTrigger = ({ className }: { className?: string }) => {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn("md:hidden", className)}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn("hidden md:inline-flex", className)}
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Collapse sidebar"
      >
        <PanelLeft className={cn("size-4 transition", collapsed && "rotate-180")} />
      </Button>
    </div>
  );
};

export {
  Sidebar,
  SidebarBackdrop,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
