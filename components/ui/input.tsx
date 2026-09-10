import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  required?: boolean
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => {
    const inputId = id ?? React.useId()
    const errorId = `${inputId}-error`
    const hintId  = `${inputId}-hint`

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-600 select-none"
        >
          {label}
          {required && (
            <span className="text-red-500 mr-0.5" aria-hidden="true"> *</span>
          )}
        </label>

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error ? errorId : '', hint ? hintId : '']
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={cn(
            'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 outline-none',
            'placeholder:text-slate-400 bg-white',
            'transition-[border-color,box-shadow] duration-150',
            // default
            'border-slate-200',
            // focus
            'focus:border-[#3157D5] focus:ring-4 focus:ring-[#3157D5]/10',
            // error
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
            // disabled
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50',
            className,
          )}
          {...props}
        />

        {/* Hint */}
        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-400 leading-snug">
            {hint}
          </p>
        )}

        {/* Error */}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-600"
          >
            <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
