import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">
        Welcome to the Content Management App
      </h1>
      <p className="mt-4 text-lg">
        A simple content management app built with Next.js
      </p>
      <Button className="mt-8">Get started</Button>
    </main>
  );
}
