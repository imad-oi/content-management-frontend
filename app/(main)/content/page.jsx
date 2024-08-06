"use client";

import Captcha from "@/components/Captcha";
import { ContentManager } from "@/components/ContentManager";
import { SessionSwitch } from "@/components/SessionSwitch";
import WelcomeBanner from "@/components/WelcomeBanner";
import { isCaptchaVerified } from "@/utils/captchaUtils";
import { useEffect, useState } from "react";

const Page = () => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setIsVerified(isCaptchaVerified());
  }, []);

  // Function to trigger re-render
  const checkVerification = (verified) => {
    if (verified) {
      setIsVerified(true);
    }
  };
  return (
    <div role="region" aria-label="Content Management Area">
      {!isVerified ? (
        <section aria-labelledby="captcha-title">
          <h2 id="captcha-title" className="sr-only">
            CAPTCHA Verification
          </h2>
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2" id="captcha-description">
              Please complete the CAPTCHA to access the content manager:
            </p>
            <Captcha
              onVerify={checkVerification}
              aria-describedby="captcha-description"
            />
          </div>
        </section>
      ) : (
        <>
          <header className="flex flex-col items-center justify-center">
            <WelcomeBanner />
            <nav aria-label="Session switcher">
              <SessionSwitch />
            </nav>
          </header>
          <main>
            <ContentManager />
          </main>
        </>
      )}
    </div>
  );
};

export default Page;
