"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function LogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    router.push("/login");
  }

  return (
    <Button
      variant="destructive"
      size="lg"
      onClick={handleLogout}
    >
      Logout
    </Button>
  )
}