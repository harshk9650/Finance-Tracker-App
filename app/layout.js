import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { DataProvider } from '@/contexts/DataContext'
import Layout from '@/components/Layout'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://your-production-url.com'), // Replace with your actual domain
  title: 'Finance Tracker | Personal Finance Management',
  description: 'Track your income, expenses, and savings with our modern finance tracker app. Set budgets, analyze spending, and achieve your financial goals.',
  // ... rest of your metadata (keywords, authors, openGraph, twitter, robots)
};

// Add a separate export for viewport
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  // ... rest of your layout component
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <CurrencyProvider>
              <DataProvider>
                <Layout>
                  {children}
                </Layout>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </DataProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



