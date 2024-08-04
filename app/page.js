"use client"

import Captcha from "@/components/Captcha";
import { Button } from "@/components/ui/button";
import WelcomeBanner from "@/components/WelcomeBanner";
import Link from "next/link";
import { useState } from "react";


export default function Home() {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <WelcomeBanner />
      <Button>
        <Link href="/content">Get Started</Link>
      </Button>
    </main>
  );
}
