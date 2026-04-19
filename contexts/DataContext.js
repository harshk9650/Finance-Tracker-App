'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  getTransactions,
  saveTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getBudget,
  setBudget,
} from '@/services/storage'
import toast from 'react-hot-toast'

const DataContext = createContext()

export const useData = () => useContext(DataContext)

export const DataProvider = ({ children }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [budget, setBudgetState] = useState({ amount: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadData()
    } else {
      setTransactions([])
      setBudgetState({ amount: 0 })
      setLoading(false)
    }
  }, [user])

  const loadData = () => {
    if (!user) return
    const userTransactions = getTransactions(user.id)
    const userBudget = getBudget(user.id)
    setTransactions(userTransactions)
    setBudgetState(userBudget)
    setLoading(false)
  }

  const addNewTransaction = useCallback(
    async (transactionData) => {
      if (!user) return
      const newTransaction = addTransaction(user.id, transactionData)
      setTransactions((prev) => [newTransaction, ...prev])
      toast.success('Transaction added successfully')
      return newTransaction
    },
    [user]
  )

  const editTransaction = useCallback(
    async (id, updates) => {
      if (!user) return
      const updated = updateTransaction(user.id, id, updates)
      if (updated) {
        setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)))
        toast.success('Transaction updated')
      }
      return updated
    },
    [user]
  )

  const removeTransaction = useCallback(
    async (id) => {
      if (!user) return
      const remaining = deleteTransaction(user.id, id)
      setTransactions(remaining)
      toast.success('Transaction deleted')
    },
    [user]
  )

  const updateBudget = useCallback(
    async (amount) => {
      if (!user) return
      const newBudget = setBudget(user.id, amount)
      setBudgetState(newBudget)
      toast.success('Budget updated')
      return newBudget
    },
    [user]
  )

  return (
    <DataContext.Provider
      value={{
        transactions,
        budget,
        loading,
        addNewTransaction,
        editTransaction,
        removeTransaction,
        updateBudget,
        refreshData: loadData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
