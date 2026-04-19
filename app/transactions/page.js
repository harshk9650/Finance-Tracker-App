'use client'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useData } from '@/contexts/DataContext'
import TransactionTable from '@/components/TransactionTable'

export default function TransactionsPage() {
  const { transactions, addNewTransaction, editTransaction, removeTransaction } = useData()

  return (
    <ProtectedRoute>
      <TransactionTable
        transactions={transactions}
        onAdd={addNewTransaction}
        onEdit={editTransaction}
        onDelete={removeTransaction}
      />
    </ProtectedRoute>
  )
}
