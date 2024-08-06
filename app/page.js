"use client"

import { Button } from "@/components/ui/button";
import WelcomeBanner from "@/components/WelcomeBanner";
import Link from "next/link";


export default function Home() {

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center p-24">
      <WelcomeBanner />
      <section className="my-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside">
          <li>Easy content management</li>
          <li>Real-time updates</li>
          <li>Secure and accessible</li>
        </ul>
      </section>
      <nav className="mt-6" aria-label="Get started">
        <Button asChild>
          <Link href="/content">Get Started with Content Management</Link>
        </Button>
      </nav>
    </main>
  );
}
