export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateTransaction = (data) => {
  const errors = {}
  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }
  if (!data.category) {
    errors.category = 'Category is required'
  }
  if (!data.date) {
    errors.date = 'Date is required'
  }
  if (!data.type) {
    errors.type = 'Type is required'
  }
  return { isValid: Object.keys(errors).length === 0, errors }
}
