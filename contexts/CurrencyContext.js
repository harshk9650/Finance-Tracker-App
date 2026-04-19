'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { currencies, convertAmount, formatCurrency as formatCurrencyUtil } from '@/utils/currency'
import { getCurrentUser, getUserSettings, saveUserSettings } from '@/services/storage'

const CurrencyContext = createContext()

export const useCurrency = () => useContext(CurrencyContext)

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      const settings = getUserSettings(currentUser.id)
      setCurrency(settings.currency || 'USD')
    } else {
      const saved = localStorage.getItem('currency')
      setCurrency(saved || 'USD')
    }
  }, [])

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency)
    if (user) {
      const settings = getUserSettings(user.id)
      saveUserSettings(user.id, { ...settings, currency: newCurrency })
    } else {
      localStorage.setItem('currency', newCurrency)
    }
  }

  const formatCurrency = (amount, baseCurrency = 'USD') => {
    const converted = convertAmount(amount, baseCurrency, currency)
    return formatCurrencyUtil(converted, currency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, updateCurrency, formatCurrency, currencies }}>
      {children}
    </CurrencyContext.Provider>
  )
}
