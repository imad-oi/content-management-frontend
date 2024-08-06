"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  useClerk,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { clearCaptchaVerification } from "@/utils/captchaUtils";
import { clearSession } from "./SessionProvider";

const Header = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    clearCaptchaVerification();
    clearSession();
  };
  return (
    <nav className="bg-white shadow-md" role="banner">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Go to homepage"
        >
          <span className="ml-2 text-xl font-bold">Content App</span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Main navigation">
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/"
                className="hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/content"
                className="hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded"
              >
                Content
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile */}
        <div>
          <SignedIn>
            <UserButton
              signOutCallback={handleSignOut}
              appearance={{
                elements: {
                  avatarBox:
                    "focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-full",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                className="focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="Sign in to your account"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Header;
