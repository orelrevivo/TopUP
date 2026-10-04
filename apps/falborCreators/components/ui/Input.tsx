import React from "react";
import { cn } from "./Button";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="block text-xs font-medium text-zinc-400">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "w-full h-9 px-3 text-xs bg-zinc-900/90 border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/80 transition-colors",
            error && "border-red-500/80 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
