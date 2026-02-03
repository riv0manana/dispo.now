import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', fullWidth = true, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white 
          focus:outline-none focus:ring-2 focus:ring-emerald-500 
          placeholder:text-zinc-600
          ${fullWidth ? 'w-full' : ''} 
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
