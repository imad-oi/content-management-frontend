import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { SessionProvider } from '../components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Text Content Manager',
  description: 'Manage and synchronize text content',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}