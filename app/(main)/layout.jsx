"use client";

import { useToast } from "@/components/ui/use-toast";
import { clearCaptchaVerification } from "@/utils/captchaUtils";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ContentLayout({ children }) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clearCaptchaVerification();
      toast({
        title: "Access Denied",
        description: "You must be signed in to view this page.",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router, toast]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
          {children}
      </div>
    </div>
  );
}
