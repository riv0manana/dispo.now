import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`border border-zinc-800 rounded-xl overflow-hidden bg-[#09090b] ${className}`}>
      {children}
    </div>
  );
}
