'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useTheme } from '@/contexts/ThemeContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Moon, Sun, DollarSign, Bell, BellOff, Download, Trash2 } from 'lucide-react'
import { exportToCSV } from '@/utils/export'
import { useData } from '@/contexts/DataContext'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { currency, currencies, updateCurrency } = useCurrency()
  const { user } = useAuth()
  const { transactions } = useData()
  const [notifications, setNotifications] = useState(true)

  const handleExportAll = () => {
    exportToCSV(transactions, `all-transactions-${Date.now()}.csv`)
    toast.success('Transactions exported successfully')
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your transaction data? This action cannot be undone.')) {
      localStorage.removeItem(`finance_tracker_transactions_${user?.id}`)
      toast.success('All transactions cleared')
      window.location.reload()
    }
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Switch between light and dark theme
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Currency Settings</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign size={20} />
              <div>
                <p className="font-medium">Default Currency</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose your preferred currency
                </p>
              </div>
            </div>
            <select
              value={currency}
              onChange={(e) => updateCurrency(e.target.value)}
              className="input w-32"
            >
              {Object.keys(currencies).map((code) => (
                <option key={code} value={code}>
                  {code} - {currencies[code].symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notifications ? <Bell size={20} /> : <BellOff size={20} />}
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive alerts for budget warnings
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                notifications
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {notifications ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Data Management</h2>
          <div className="space-y-3">
            <button
              onClick={handleExportAll}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download size={20} />
                <span>Export All Transactions</span>
              </div>
              <span className="text-sm text-primary-500">Export CSV</span>
            </button>

            <button
              onClick={handleClearData}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={20} />
                <span>Clear All Transaction Data</span>
              </div>
              <span className="text-sm">Delete</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Account Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400">Name</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 dark:text-gray-400">Member Since</span>
              <span className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
