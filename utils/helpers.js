export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const getCurrentMonthYear = () => {
  const now = new Date()
  return {
    month: now.getMonth(),
    year: now.getFullYear(),
    monthYear: `${now.getFullYear()}-${now.getMonth() + 1}`,
  }
}

export const isCurrentMonth = (date) => {
  const d = new Date(date)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export const filterTransactionsByMonth = (transactions, month, year) => {
  return transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === month && d.getFullYear() === year
  })
}

export const groupByCategory = (transactions) => {
  return transactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + t.amount
    }
    return acc
  }, {})
}

export const getMonthlyData = (transactions, months = 6) => {
  const result = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthTransactions = transactions.filter((t) => {
      const td = new Date(t.date)
      return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()
    })
    const income = monthTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = monthTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    result.push({
      month: d.toLocaleString('default', { month: 'short' }),
      income,
      expense,
      savings: income - expense,
    })
  }
  return result
}

export const calculateTotals = (transactions) => {
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense
  return { income, expense, balance }
}

export const getCurrentMonthSavings = (transactions) => {
  const { month, year } = getCurrentMonthYear()
  const monthTransactions = filterTransactionsByMonth(transactions, month, year)
  const income = monthTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = monthTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return income - expense
}
