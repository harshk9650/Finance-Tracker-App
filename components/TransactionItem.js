'use client'
import { motion } from 'framer-motion'
import { Edit2, Trash2 } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import { useCurrency } from '@/contexts/CurrencyContext'

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const { formatCurrency } = useCurrency()
  const isIncome = transaction.type === 'income'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${
              isIncome ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="font-medium">{transaction.category}</span>
          {transaction.notes && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {transaction.notes}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {formatDate(transaction.date)}
        </div>
      </div>

      <div className="text-right">
        <div className={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </div>
      </div>

      <div className="flex gap-2 ml-4">
        <button
          onClick={() => onEdit(transaction)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  )
}
