'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useData } from '@/contexts/DataContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { calculateTotals, getCurrentMonthSavings, isCurrentMonth } from '@/utils/helpers'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Plus } from 'lucide-react'
import RecentTransactions from '@/components/RecentTransactions'
import AddTransactionModal from '@/components/AddTransactionModal'
import BudgetProgress from '@/components/BudgetProgress'

export default function DashboardPage() {
  const { transactions, budget, addNewTransaction, updateBudget } = useData()
  const { formatCurrency } = useCurrency()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [budgetAmount, setBudgetAmount] = useState(budget.amount)

  const totals = calculateTotals(transactions)
  const monthlySavings = getCurrentMonthSavings(transactions)
  const currentMonthExpenses = transactions
    .filter((t) => t.type === 'expense' && isCurrentMonth(t.date))
    .reduce((s, t) => s + t.amount, 0)

  const stats = [
    {
      title: 'Total Balance',
      value: formatCurrency(totals.balance),
      icon: DollarSign,
      color: 'text-primary-500',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      title: 'Total Income',
      value: formatCurrency(totals.income),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totals.expense),
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Monthly Savings',
      value: formatCurrency(monthlySavings),
      icon: PiggyBank,
      color: 'text-secondary-500',
      bg: 'bg-secondary-50 dark:bg-secondary-900/20',
    },
  ]

  const handleSetBudget = () => {
    if (budgetAmount > 0) {
      updateBudget(budgetAmount)
      setIsBudgetModalOpen(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Transaction
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <BudgetProgress
            budget={budget.amount}
            currentExpenses={currentMonthExpenses}
            onSetBudget={() => {
              setBudgetAmount(budget.amount)
              setIsBudgetModalOpen(true)
            }}
          />
          <RecentTransactions transactions={transactions} />
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addNewTransaction}
      />

      {isBudgetModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Set Monthly Budget</h2>
            <input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter budget amount"
              className="input mb-4"
              step="0.01"
            />
            <div className="flex gap-3">
              <button onClick={handleSetBudget} className="btn-primary flex-1">
                Save Budget
              </button>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </ProtectedRoute>
  )
}
