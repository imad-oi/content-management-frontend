'use client'

import Captcha from "@/components/Captcha";
import { ContentManager } from "@/components/ContentManager";
import { SessionSwitch } from "@/components/SessionSwitch";
import WelcomeBanner from "@/components/WelcomeBanner";
import { isCaptchaVerified } from "@/utils/captchaUtils";
import { useEffect, useState } from "react";

const page = () => {
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
    <div>
      {!isVerified ? (
        <div className="flex flex-col items-center justify-center">
          <p className="mb-2">
            Please complete the CAPTCHA to access the content manager:
          </p>
          <Captcha onVerify={checkVerification} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center">
            <WelcomeBanner />
            <SessionSwitch />
          </div>
          <ContentManager />
        </>
      )}
    </div>
  );
};

export default page;
