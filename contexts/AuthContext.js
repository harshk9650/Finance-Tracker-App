'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, logout as logoutUser, authenticateUser, createUser } from '@/services/storage'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    setUser(user)
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const user = authenticateUser(email, password)
      setUser(user)
      router.push('/dashboard')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const user = createUser(email, password, name)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    logoutUser()
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
