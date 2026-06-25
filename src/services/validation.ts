// Servicio centralizado de validación

export const ValidationRules = {
  // Emails
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Correo electrónico inválido',
  },

  // Teléfono (formato flexible)
  phone: {
    pattern: /^[0-9\s\-\+\(\)]{7,}$/,
    message: 'Teléfono inválido (mínimo 7 dígitos)',
  },

  // Nombres (mínimo 2 caracteres)
  name: {
    min: 2,
    max: 100,
    message: 'El nombre debe tener entre 2 y 100 caracteres',
  },

  // Contraseñas (mínimo 6 caracteres)
  password: {
    min: 6,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'La contraseña debe tener al menos 6 caracteres, una mayúscula y un número',
  },

  // Números de crédito
  creditCard: {
    pattern: /^[0-9]{13,19}$/,
    message: 'Número de tarjeta inválido',
  },

  // Código postal
  zipCode: {
    pattern: /^[0-9]{5,}$/,
    message: 'Código postal inválido',
  },
}

export const validateEmail = (email: string): boolean => {
  return ValidationRules.email.pattern.test(email)
}

export const validatePhone = (phone: string): boolean => {
  return ValidationRules.phone.pattern.test(phone)
}

export const validateName = (name: string): boolean => {
  return name.length >= ValidationRules.name.min && name.length <= ValidationRules.name.max
}

export const validatePassword = (password: string): boolean => {
  return password.length >= ValidationRules.password.min &&
    ValidationRules.password.pattern.test(password)
}

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

export const validateNumber = (value: any, min?: number, max?: number): boolean => {
  const num = Number(value)
  if (isNaN(num)) return false
  if (min !== undefined && num < min) return false
  if (max !== undefined && num > max) return false
  return true
}

export const validateAge = (age: number): boolean => {
  return validateNumber(age, 0, 150)
}

export const getValidationRules = (fieldType: string) => {
  const rulesMap: Record<string, any> = {
    email: [
      { required: true, message: 'Email requerido' },
      { type: 'email', message: ValidationRules.email.message },
    ],
    phone: [
      { required: true, message: 'Teléfono requerido' },
      {
        pattern: ValidationRules.phone.pattern,
        message: ValidationRules.phone.message,
      },
    ],
    name: [
      { required: true, message: 'Nombre requerido' },
      {
        min: ValidationRules.name.min,
        max: ValidationRules.name.max,
        message: ValidationRules.name.message,
      },
    ],
    password: [
      { required: true, message: 'Contraseña requerida' },
      {
        min: ValidationRules.password.min,
        message: `Mínimo ${ValidationRules.password.min} caracteres`,
      },
    ],
    age: [
      { required: true, message: 'Edad requerida' },
      {
        pattern: /^[0-9]{1,3}$/,
        message: 'Edad inválida',
      },
    ],
  }

  return rulesMap[fieldType] || [{ required: true, message: `${fieldType} requerido` }]
}
