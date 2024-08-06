'use client'

import { SignedIn, SignedOut, SignInButton, useClerk, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from './ui/button'
import { clearCaptchaVerification } from '@/utils/captchaUtils';
import { clearSession } from './SessionProvider';

const Header = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    clearCaptchaVerification();
    clearSession();
  };
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="ml-2 text-xl font-bold">Content App</span>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" className="hover:text-slate-500">Home</Link></li>
            <li><Link href="/content" className="hover:text-slate-500">Content</Link></li>
          </ul>
        </nav>

        {/* User Profile */}
        <div>
          <SignedIn>
            <UserButton signOutCallback={handleSignOut}  />
          </SignedIn>
          <SignedOut>
            {/* Signed out users get sign in button */}
            <SignInButton mode="modal">
              <Button className=" ">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header