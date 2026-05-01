"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import authService from "@/services/authService"
import useAuthStore from "@/store/useAuthStore"
import { useAuth } from "@/components/AuthProvider"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const LoginPage = () => {
  const { data, setData } = useAuthStore();
  const { refresh } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await authService.login({ email: data.email, password: data.password });

      localStorage.setItem("accessToken", res.data.tokens.accessToken);
      localStorage.setItem("userId", res.data.user.id);

      await refresh();

      toast.success(res.data.message || "Logged in successfully");
      const hasCompletedOnboarding = Boolean(res.data?.user?.onboardingCompleted);
      router.push(hasCompletedOnboarding ? "/home" : "/onboarding");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message || "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg px-6 py-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Log In to Your Account</CardTitle>
        <CardDescription>
          Fill in the form below to log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="block space-y-1.5">
            <Label className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              placeholder="you@email.com"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
              value={data.password}
              onChange={handleChange}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 rounded-none bg-background">
        <Button type="submit" size="lg" className="h-11 w-full rounded-xl text-sm font-semibold cursor-pointer" onClick={handleSubmit}>
          Log in
          <ArrowRight className="size-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/register" className="underline">
            Register
          </a>
        </span>
      </CardFooter>
    </Card>
  )
}

export default LoginPage