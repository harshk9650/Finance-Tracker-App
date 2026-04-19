import { useState, useMemo } from 'react'
import { getCurrentMonthYear } from '@/utils/helpers'

export const useTransactions = (transactions) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterType, setFilterType] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCategory) {
      filtered = filtered.filter((t) => t.category === filterCategory)
    }

    if (filterType) {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    if (dateRange.start) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(dateRange.start))
    }

    if (dateRange.end) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(dateRange.end))
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, searchTerm, filterCategory, filterType, dateRange])

  const stats = useMemo(() => {
    const totalIncome = filteredTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const totalExpense = filteredTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const balance = totalIncome - totalExpense
    return { totalIncome, totalExpense, balance, count: filteredTransactions.length }
  }, [filteredTransactions])

  return {
    filteredTransactions,
    stats,
    filters: {
      searchTerm,
      setSearchTerm,
      filterCategory,
      setFilterCategory,
      filterType,
      setFilterType,
      dateRange,
      setDateRange,
    },
  }
}
