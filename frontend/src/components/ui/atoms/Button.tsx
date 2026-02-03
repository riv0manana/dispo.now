import { type ReactNode, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', isLoading, children, className = '', ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center transition-colors font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-500 text-black hover:bg-emerald-400 px-4 py-2",
    secondary: "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 px-4 py-2",
    ghost: "text-zinc-500 hover:text-white px-2 py-1",
    danger: "text-zinc-500 hover:text-red-400 px-2 py-1",
    icon: "text-zinc-500 hover:text-white p-1",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
      {children}
    </button>
  );
}
