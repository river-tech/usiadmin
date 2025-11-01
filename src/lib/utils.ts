import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyVND(value: number | string | null | undefined) {
  const num = Number(value || 0);
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  } catch {
    return `${num.toLocaleString('vi-VN')} ₫`;
  }
}
