'use client'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { groupByCategory, getMonthlyData } from '@/utils/helpers'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function AnalyticsCharts({ transactions }) {
  const expenseByCategory = groupByCategory(transactions)
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }))

  const monthlyData = getMonthlyData(transactions)

  const incomeVsExpenseData = monthlyData.map((m) => ({
    month: m.month,
    Income: m.income,
    Expenses: m.expense,
  }))

  return (
    <div className="space-y-8">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Expense Breakdown by Category</h3>
        {pieData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">
            No expense data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Monthly Spending by Category</h3>
        {monthlyData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">
            No data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#10b981" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Income vs Expenses Over Time</h3>
        {incomeVsExpenseData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">
            No data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={incomeVsExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
