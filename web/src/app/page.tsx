import Link from "next/link";
import { Check, Megaphone, MessageSquare, ShieldCheck, Users } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen scroll-smooth bg-background text-foreground font-sans antialiased">
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link className="font-bold tracking-tighter text-foreground text-2xl" href="/">
            Clastle
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a
              className="tracking-tight text-muted-foreground transition-colors duration-300 hover:text-foreground text-lg"
              href="#features"
            >
              Features
            </a>
            <a
              className="tracking-tight text-muted-foreground transition-colors duration-300 hover:text-foreground text-lg"
              href="#community"
            >
              Community
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link
              className="tracking-tight text-muted-foreground transition-colors duration-300 hover:text-foreground active:scale-95 text-lg"
              href="/login"
            >
              Log In
            </Link>
            <Link
              className="rounded-lg bg-primary px-6 py-2 text-primary-foreground shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-transform duration-150 active:scale-95"
              href="/register"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 md:pt-32">
        <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-16 md:py-24 lg:grid-cols-2">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl mb-6 text-primary">
              Connect. Join. Share. Build your school community.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              The all-in-one social platform for school clubs. Streamline announcements,
              foster engagement, and manage memberships with ease.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                href="/register"
              >
                Get Started
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-transparent px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                href="/login"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border bg-card p-4">
            <div className="flex h-full w-full flex-col gap-4 rounded-lg border bg-background p-6 shadow-sm">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="h-6 w-24 rounded bg-primary"></div>
                <div className="flex gap-4">
                  <div className="h-4 w-12 rounded bg-border/50"></div>
                  <div className="h-4 w-12 rounded bg-border/50"></div>
                  <div className="h-6 w-8 rounded-full bg-border"></div>
                </div>
              </div>
              <div className="flex flex-1 gap-6 pt-2">
                <div className="hidden w-1/4 flex-col gap-3 border-r pr-4 sm:flex">
                  <div className="h-4 w-full rounded bg-border/30"></div>
                  <div className="h-4 w-5/6 rounded bg-border/30"></div>
                  <div className="h-4 w-3/4 rounded bg-border/30"></div>
                  <div className="mt-8 h-4 w-full rounded bg-border/30"></div>
                  <div className="h-4 w-4/6 rounded bg-border/30"></div>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-border/50"></div>
                      <div className="h-3 w-32 rounded bg-primary/20"></div>
                    </div>
                    <div className="mb-2 h-20 w-full rounded bg-border/10"></div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-border/50"></div>
                      <div className="h-3 w-24 rounded bg-primary/20"></div>
                    </div>
                    <div className="h-12 w-3/4 rounded bg-border/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y bg-muted/40 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-primary">
                Empowering School Connections
              </h2>
              <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
                Everything you need to run your club smoothly and keep members engaged.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border bg-card p-8 transition-all duration-300 hover:shadow-lg">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Club-based networking</h3>
                <p className="text-muted-foreground">
                  Discover and join specialized micro-communities tailored to your exact academic and extracurricular interests.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-8 transition-all duration-300 hover:shadow-lg">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Megaphone className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Real-time Announcements</h3>
                <p className="text-muted-foreground">
                  Keep everyone on the same page with instant broadcasts, pinned messages, and urgent alerts.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-8 transition-all duration-300 hover:shadow-lg">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <MessageSquare className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Interactive Post Sharing</h3>
                <p className="text-muted-foreground">
                  Foster dynamic discussions with rich media sharing, threaded replies, and community polls.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-8 transition-all duration-300 hover:shadow-lg">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Role-based Access</h3>
                <p className="text-muted-foreground">
                  Granular control over who can post, moderate, and invite, ensuring your community remains secure and focused.
                </p>
              </div>
            </div>
          </div>
        </section>


        <section id="community" className="border-y bg-muted/40 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div className="order-2 flex aspect-[16/9] flex-col rounded-xl border bg-card p-4 shadow-sm lg:order-1">
                <div className="mb-4 flex w-full items-center justify-between border-b pb-4">
                  <div className="h-6 w-32 rounded bg-border"></div>
                  <div className="h-8 w-8 rounded-full bg-border"></div>
                </div>
                <div className="flex flex-1 gap-6">
                  <div className="hidden w-1/3 flex-col gap-4 border-r pr-6 sm:flex">
                    <div className="h-4 w-full rounded bg-border/30"></div>
                    <div className="h-4 w-5/6 rounded bg-border/30"></div>
                    <div className="h-4 w-4/6 rounded bg-border/30"></div>
                  </div>
                  <div className="flex flex-1 flex-col gap-6">
                    <div className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-border/50"></div>
                        <div className="h-3 w-24 rounded bg-border/50"></div>
                      </div>
                      <div className="mb-2 h-16 w-full rounded bg-border/20"></div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-border/50"></div>
                        <div className="h-3 w-32 rounded bg-border/50"></div>
                      </div>
                      <div className="h-8 w-full rounded bg-border/20"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6 text-primary">
                  Designed for Clarity. Built for Focus.
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  We removed the noise so your community can thrive. Our minimalist interface ensures that important announcements and meaningful discussions are always front and center, free from algorithmic distractions.
                </p>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-center gap-3 text-foreground">
                    <Check className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    Distraction-free reading environment
                  </li>
                  <li className="flex items-center gap-3 text-foreground">
                    <Check className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    High-contrast typography for legibility
                  </li>
                  <li className="flex items-center gap-3 text-foreground">
                    <Check className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    Intuitive, fluid navigation paths
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background px-6 py-32 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl mb-8 text-primary">
              Start building your school network today
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join thousands of student leaders who are organizing better, communicating clearer, and growing their communities on Clastle.
            </p>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-10 text-lg font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
              href="/register"
            >
              Create Account
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-auto w-full border-t bg-background py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 text-center md:flex-row md:text-left">
          <div>
            <span className="text-lg font-bold text-foreground">Clastle</span>
            <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
              © 2024 Clastle. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:justify-end">
            <Link className="tracking-tight px-4 py-2 text-muted-foreground transition-colors duration-300 hover:text-foreground text-sm"
              href="/login"
            >
              Log In
            </Link>
            <Link
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              href="/register"
            >
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;