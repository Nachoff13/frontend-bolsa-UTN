import React from 'react'
import { clsx } from 'clsx'

interface InputProps {
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = ''
}: InputProps) {
  return (
    <div className={className}>
      {label && (
        <label>
          {label}
          {required && <span>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
      {error && <span>{error}</span>}
    </div>
  )
} 