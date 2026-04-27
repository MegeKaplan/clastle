"use client";
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
import { getPostAuthRedirectPath } from "@/lib/onboardingStorage"
import authService from "@/services/authService"
import useAuthStore from "@/store/useAuthStore"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation";
import { toast } from "sonner"

const RegisterPage = () => {
  const { data, setData } = useAuthStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ [name]: value });
  };

  const handleSubmit = async () => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await authService.register({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password });

      localStorage.setItem("accessToken", res.data.tokens.accessToken);
      localStorage.setItem("userId", res.data.user.id);

      toast.success(res.data.message || "Account created successfully");
      router.push(getPostAuthRedirectPath());
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg px-6 py-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
        <CardDescription>
          Fill in the form below to create your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                First name
              </Label>
              <Input
                type="text"
                name="firstName"
                placeholder="Ada"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
                value={data.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                Last name
              </Label>
              <Input
                type="text"
                name="lastName"
                placeholder="Lovelace"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
                value={data.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
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
          <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="space-y-1.5">
              <Label className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
                Confirm
              </Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/30"
                value={data.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 rounded-none bg-background">
        <Button size="lg" className="h-11 w-full rounded-xl text-sm font-semibold cursor-pointer" onClick={handleSubmit}>
          Create account
          <ArrowRight className="size-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/login" className="underline">
            Log in
          </a>
        </span>
      </CardFooter>
    </Card>
  )
}

export default RegisterPage