import Header from '@/components/Header'
import { Toaster } from '@/components/ui/toaster'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { SessionProvider } from '../components/SessionProvider'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Text Content Manager',
  description: 'Manage and synchronize text content',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignOutUrl='/'>
      <html lang="en">
        <body className={inter.className}>
          <SessionProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only ...">
              Skip to main content
            </a>
            <Header />
            <main id="main-content">
              {children}
            </main>
            <footer className="mt-8 text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} Content Management App. All rights reserved.</p>
            </footer>
            <Toaster />
          </SessionProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}