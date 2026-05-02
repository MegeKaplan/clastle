"use client"
import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background">
      {!isAdminRoute ? <Navbar /> : null}
      <main
        className={cn(
          "mx-auto w-full max-w-6xl",
          isAdminRoute ? "p-0" : "px-4 pb-16 pt-24 sm:px-6"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;