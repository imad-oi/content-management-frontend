import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { SessionProvider } from '../components/SessionProvider'
import '../styles/globals.css'
import Header from '@/components/Header'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Text Content Manager',
  description: 'Manage and synchronize text content',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      afterSignOutUrl='/'
    >
      <html lang="en">
        <body className={inter.className}>
          <SessionProvider>
            <Header />
            {children}
            <Toaster />
          </SessionProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}