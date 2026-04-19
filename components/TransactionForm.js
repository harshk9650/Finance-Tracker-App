'use client'
import { useState } from 'react'
import { validateTransaction } from '@/utils/validation'

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  expense: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Other'],
}

export default function TransactionForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      type: 'expense',
      category: 'Food',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    }
  )
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const { isValid, errors: validationErrors } = validateTransaction(formData)
    if (!isValid) {
      setErrors(validationErrors)
      return
    }
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'type') {
      setFormData((prev) => ({
        ...prev,
        type: value,
        category: value === 'income' ? 'Salary' : 'Food',
      }))
    }
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Transaction Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Expense
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Income
          </label>
        </div>
      </div>

      <div>
        <label className="label">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input"
        >
          {categories[formData.type].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          className="input"
        />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
      </div>

      <div>
        <label className="label">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      <div>
        <label className="label">Notes (Optional)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="Add a note..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" className="btn-primary flex-1">
          {initialData ? 'Update' : 'Add'} Transaction
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}
