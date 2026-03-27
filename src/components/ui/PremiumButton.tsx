import type { ButtonHTMLAttributes, ReactNode } from "react";

export default function PremiumButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button {...props} className={`btn-primary ${className}`}>
      {children}
    </button>
  );
}
