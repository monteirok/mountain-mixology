import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BookEventButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function BookEventButton({ className, ...props }: BookEventButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full px-8 py-4 text-lg bg-mountain-gold text-charcoal font-semibold transition-all duration-300 hover:bg-copper shadow-lg",
        className
      )}
      {...props}
    >
      Book Event
    </button>
  );
}
