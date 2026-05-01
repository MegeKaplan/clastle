const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen">
      <div className="max-w-6xl h-full mx-auto grid xl:grid-cols-2">
        <section className="hidden xl:flex justify-center flex-col gap-6">
          <p className="px-4 py-2 rounded-full border border-border/60 text-xs inline-flex tracking-widest text-muted-foreground self-start">
            CLASTLE ONBOARDING
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-snug text-foreground">
            Find your best-fit club, <br />
            discover your strengths, <br />
            start your journey.
          </h1>
          <p className="text-muted-foreground">
            Answer a short set of meaningful questions and we will match you with the club where your interests can grow the most.
          </p>
        </section>

        <section className="w-full flex justify-center items-center">{children}</section>
      </div>
    </div>
  );
};

export default OnboardingLayout;
