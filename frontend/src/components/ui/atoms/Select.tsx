import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', fullWidth = true, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white 
          focus:outline-none focus:ring-2 focus:ring-emerald-500 
          placeholder:text-zinc-600
          ${fullWidth ? 'w-full' : ''} 
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
