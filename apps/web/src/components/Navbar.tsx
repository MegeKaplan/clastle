"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Home, LogOut, PlusCircle, Shield, User } from "lucide-react";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPERADMIN";

  const navLinks = useMemo(
    () => [
      { href: "/home", label: "Home", icon: Home },
      { href: "/new", label: "New", icon: PlusCircle },
      { href: "/profile", label: "Profile", icon: User },
    ],
    []
  );

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const initials = useMemo(() => {
    const first = user?.firstName?.[0] ?? "";
    const last = user?.lastName?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "U";
  }, [user]);

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/home" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="size-4" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Clastle</span>
            <span className="text-xs text-muted-foreground">Student Clubs</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link key={href} href={href}>
                <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2">
                  <Icon className="size-4" />
                  {label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 rounded-full bg-muted" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {initials}
                </span>
                <span className="hidden text-sm sm:inline">{user.firstName || "Account"}</span>
                <ChevronDown className={cn("size-4 transition", menuOpen && "rotate-180")} />
              </Button>

              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-background p-3 shadow-lg">
                  <div className="space-y-1 border-b pb-3">
                    <div className="text-sm font-semibold text-foreground">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                    {user.role ? <Badge variant="outline">{user.role}</Badge> : null}
                  </div>

                  <div className="mt-3 grid gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start"
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/profile");
                      }}
                    >
                      Profile
                    </Button>
                    {isAdmin ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        onClick={() => {
                          setMenuOpen(false);
                          router.push("/admin/users");
                        }}
                      >
                        Admin Dashboard
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 size-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="border-t bg-background/95 md:hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-3 gap-2 px-4 py-2">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} className="flex items-center justify-center">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full gap-2"
                >
                  <Icon className="size-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;