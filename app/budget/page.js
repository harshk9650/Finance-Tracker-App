'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useData } from '@/contexts/DataContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Edit2 } from 'lucide-react'
import { isCurrentMonth } from '@/utils/helpers'

export default function BudgetPage() {
  const { transactions, budget, updateBudget } = useData()
  const { formatCurrency } = useCurrency()
  const [isEditing, setIsEditing] = useState(false)
  const [budgetAmount, setBudgetAmount] = useState(budget.amount)

  const currentMonthExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense' && isCurrentMonth(t.date))
      .reduce((s, t) => s + t.amount, 0)
  }, [transactions])

  const percentage = budget.amount > 0 ? (currentMonthExpenses / budget.amount) * 100 : 0
  const isOverBudget = currentMonthExpenses > budget.amount
  const remaining = budget.amount - currentMonthExpenses

  const handleSaveBudget = () => {
    if (budgetAmount > 0) {
      updateBudget(budgetAmount)
      setIsEditing(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Budget Planner</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Budget
          </button>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Monthly Budget Overview</h2>
          
          {budget.amount > 0 ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Spending Progress</span>
                  <span>
                    {formatCurrency(currentMonthExpenses)} / {formatCurrency(budget.amount)}
                  </span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      isOverBudget
                        ? 'bg-red-500'
                        : percentage >= 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Budget Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(budget.amount)}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Spent So Far</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(currentMonthExpenses)}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                  <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(remaining))}
                    {remaining < 0 && ' over'}
                  </p>
                </div>
              </div>

              {isOverBudget ? (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="text-red-600" />
                  <div>
                    <p className="font-semibold text-red-600">Budget Exceeded!</p>
                    <p className="text-sm text-red-600/80">
                      You&apos;ve exceeded your monthly budget by {formatCurrency(Math.abs(remaining))}
                    </p>
                  </div>
                </div>
              ) : percentage >= 80 ? (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-600">Budget Warning</p>
                    <p className="text-sm text-yellow-600/80">
                      You&apos;ve used {percentage.toFixed(0)}% of your budget. {formatCurrency(remaining)} remaining.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-3">
                  <CheckCircle className="text-green-600" />
                  <div>
                    <p className="font-semibold text-green-600">On Track!</p>
                    <p className="text-sm text-green-600/80">
                      You&apos;re within your budget. Keep up the good work!
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No budget set for this month
              </p>
              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Set Monthly Budget
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Category Spending (This Month)</h3>
          <div className="space-y-3">
            {(() => {
              const categorySpending = transactions
                .filter((t) => t.type === 'expense' && isCurrentMonth(t.date))
                .reduce((acc, t) => {
                  acc[t.category] = (acc[t.category] || 0) + t.amount
                  return acc
                }, {})
              
              if (Object.keys(categorySpending).length === 0) {
                return <p className="text-gray-500 dark:text-gray-400 text-center py-8">No expenses this month</p>
              }
              
              return Object.entries(categorySpending)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="font-medium">{category}</span>
                    <span className="text-red-600">{formatCurrency(amount)}</span>
                  </div>
                ))
            })()}
          </div>
        </div>
      </div>

      {isEditing && (
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
              <button onClick={handleSaveBudget} className="btn-primary flex-1">
                Save Budget
              </button>
              <button
                onClick={() => setIsEditing(false)}
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
