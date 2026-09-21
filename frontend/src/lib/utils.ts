import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Hợp nhất các class Tailwind CSS an toàn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
