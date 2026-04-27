"use client"

import { Button } from "@/components/ui/button"
import authService from "@/services/authService"
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
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