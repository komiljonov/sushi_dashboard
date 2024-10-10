import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { IPromocode } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function splitToHundreds(num: number | undefined): string {

  if (!num) {
    return "";
  }
  // Convert the number to a string
  const numStr = num.toString();

  // Use regex to split the string into groups of three digits
  const splitNum = numStr.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  return splitNum;
}





export function calculate_discount(promocode: IPromocode | null, price: number): number {
  // If there is no promocode, return the original price
  if (promocode === null) {
    return price;
  }

  // If the promocode measurement is PERCENT, calculate the discount based on percentage
  if (promocode.measurement === "PERCENT") {
    return price - ((price / 100) * promocode.amount);
  }

  // For other types of promocode measurement, subtract the amount directly
  return price - promocode.amount;
}