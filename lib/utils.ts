import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function splitToHundreds(num: number): string {
  // Convert the number to a string
  const numStr = num.toString();
  
  // Use regex to split the string into groups of three digits
  const splitNum = numStr.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  
  return splitNum;
}