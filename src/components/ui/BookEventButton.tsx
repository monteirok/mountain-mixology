import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface BookEventButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "white" | "glass";
}

export default function BookEventButton({ 
  className, 
  children, 
  variant = "primary",
  ...props 
}: BookEventButtonProps) {
  const baseStyles = "rounded-full px-2 py-3 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0";
  
  const variants = {
    primary: "bg-mountain-gold text-lg text-charcoal hover:bg-[#b68c0e]",
    secondary: "bg-white/10 text-white backdrop-blur hover:bg-white/20 border border-white/10",
    white: "bg-white text-forest hover:bg-mountain-gold hover:text-white shadow-xl hover:shadow-2xl",
    glass: "bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 hover:scale-105"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      {...props}
    >
      {children ?? "Book Event"}
    </button>
  );
}
