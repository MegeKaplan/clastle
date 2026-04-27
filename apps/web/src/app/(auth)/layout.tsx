const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen">
      <div className="max-w-6xl h-full mx-auto grid xl:grid-cols-2">
        <section className="hidden xl:flex justify-center flex-col gap-6">
          <p className="px-4 py-2 rounded-full border border-border/60 text-xs inline-flex tracking-widest text-muted-foreground self-start">CLASTLE AUTH</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-snug text-foreground">
            Pick your club, <br />
            discover your talent, <br />
            make a difference.
          </h1>
          <p className="text-muted-foreground">
            Join clubs that match your interests, grow your skills through real collaboration, and turn your talent into meaningful impact with Clastle Social.
          </p>
        </section>

        <section className="w-full flex justify-center items-center">
          {children}
        </section>
      </div>
    </div>
  );
}

export default AuthLayout;