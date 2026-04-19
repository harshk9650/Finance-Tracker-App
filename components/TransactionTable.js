'use client'
import { useState } from 'react'
import { Search, Filter, Download } from 'lucide-react'
import TransactionItem from './TransactionItem'
import AddTransactionModal from './AddTransactionModal'
import { exportToCSV } from '@/utils/export'
import { useTransactions } from '@/hooks/useTransactions'

const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Other', 'Salary', 'Freelance', 'Investment', 'Gift']

export default function TransactionTable({ transactions, onAdd, onEdit, onDelete }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const { filteredTransactions, stats, filters } = useTransactions(transactions)

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  const handleExport = () => {
    exportToCSV(filteredTransactions, `transactions-${Date.now()}.csv`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Export CSV
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            + Add Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
          <p className="text-2xl font-bold text-green-600">+${stats.totalIncome.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">-${stats.totalExpense.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
          <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats.balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.searchTerm}
                onChange={(e) => filters.setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <select
            value={filters.filterType}
            onChange={(e) => filters.setFilterType(e.target.value)}
            className="input w-32"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.filterCategory}
            onChange={(e) => filters.setFilterCategory(e.target.value)}
            className="input w-40"
          >
            <option value="">All Categories</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => filters.setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="input w-36"
          />

          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => filters.setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="input w-36"
          />

          {(filters.searchTerm || filters.filterCategory || filters.filterType || filters.dateRange.start || filters.dateRange.end) && (
            <button
              onClick={() => {
                filters.setSearchTerm('')
                filters.setFilterCategory('')
                filters.setFilterType('')
                filters.setDateRange({ start: '', end: '' })
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary mt-4">
              Add Your First Transaction
            </button>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAdd={async (data) => {
          if (editingTransaction) {
            await onEdit(editingTransaction.id, data)
          } else {
            await onAdd(data)
          }
          handleModalClose()
        }}
      />
    </div>
  )
}
