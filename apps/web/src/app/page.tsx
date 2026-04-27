import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h1 className="text-5xl font-bold">Hello world!</h1>
      <LogoutButton />
    </div>
  );
}
