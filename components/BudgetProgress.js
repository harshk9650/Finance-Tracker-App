'use client'
import { AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BudgetProgress({ budget, currentExpenses, onSetBudget }) {
  const percentage = budget > 0 ? (currentExpenses / budget) * 100 : 0
  const isOverBudget = currentExpenses > budget
  const isWarning = percentage >= 80 && percentage < 100

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Monthly Budget</h3>
        <button onClick={onSetBudget} className="text-primary-500 hover:text-primary-600 text-sm">
          {budget > 0 ? 'Edit Budget' : 'Set Budget'}
        </button>
      </div>

      {budget > 0 ? (
        <>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>
              ${currentExpenses.toFixed(2)} / ${budget.toFixed(2)}
            </span>
          </div>

          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                isOverBudget
                  ? 'bg-red-500'
                  : isWarning
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
          </div>

          <div className="mt-3 text-sm">
            {isOverBudget ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={16} />
                <span>Budget exceeded by ${(currentExpenses - budget).toFixed(2)}</span>
              </div>
            ) : isWarning ? (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle size={16} />
                <span>Warning: ${(budget - currentExpenses).toFixed(2)} remaining</span>
              </div>
            ) : (
              <div className="text-gray-600 dark:text-gray-400">
                ${(budget - currentExpenses).toFixed(2)} remaining
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No budget set for this month
          </p>
          <button onClick={onSetBudget} className="btn-primary">
            Set Monthly Budget
          </button>
        </div>
      )}
    </div>
  )
}
