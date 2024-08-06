"use client"

import { Button } from "@/components/ui/button";
import WelcomeBanner from "@/components/WelcomeBanner";
import Link from "next/link";


export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <WelcomeBanner />
      <Button>
        <Link href="/content">Get Started</Link>
      </Button>
    </main>
  );
}
