'use client'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import { useCurrency } from '@/contexts/CurrencyContext'

export default function RecentTransactions({ transactions }) {
  const { formatCurrency } = useCurrency()
  const recent = transactions.slice(0, 5)

  if (recent.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No transactions yet. Add your first transaction!
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {recent.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  transaction.type === 'income'
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}
              >
                {transaction.type === 'income' ? (
                  <ArrowUpRight size={16} className="text-green-600" />
                ) : (
                  <ArrowDownRight size={16} className="text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium">{transaction.category}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div
              className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}{' '}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
