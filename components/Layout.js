'use client'
import Sidebar from './Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Layout({ children }) {
  const { user } = useAuth()
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/'

  if (!user || isAuthPage) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="ml-64 p-8"
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </motion.main>
    </div>
  )
}
