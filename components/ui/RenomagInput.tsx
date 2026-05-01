import * as React from 'react'
import { cn } from '@/lib/utils'

export interface RenomagInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const RenomagInput = React.forwardRef<HTMLInputElement, RenomagInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn('input-field', className)}
        ref={ref}
        {...props}
      />
    )
  }
)
RenomagInput.displayName = 'RenomagInput'

export { RenomagInput }
