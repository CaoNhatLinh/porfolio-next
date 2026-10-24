import type { ButtonHTMLAttributes } from "react";
import { cn } from "./cn";

type ButtonVariant = "accent" | "quiet" | "outline" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "outline", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn("focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-45", variantClass[variant], className)} {...props} />;
}

const variantClass: Record<ButtonVariant, string> = {
  accent: "bg-[var(--accent)] text-[var(--accent-ink)] hover:brightness-95",
  quiet: "border border-current/20 text-current hover:bg-current/5",
  outline: "border border-black/15 text-[var(--ink)] hover:bg-black/5",
  danger: "border border-red-200 text-red-700 hover:bg-red-50",
};
