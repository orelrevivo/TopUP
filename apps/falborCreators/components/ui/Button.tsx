import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "sm", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:shadow-indigo-500/25",
      secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700",
      outline: "border border-zinc-700 hover:bg-zinc-800 text-zinc-300",
      danger: "bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20",
      ghost: "hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-10 px-5 text-base gap-2",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
