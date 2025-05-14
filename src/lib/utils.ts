import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Accepts a currency code (e.g., 'USD', 'INR', 'AED') and returns a formatted string for display with the appropriate symbol.
// Input currency should always be a code, never a symbol.
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  // Normalize currency code to uppercase and remove any symbols accidentally passed
  const normalizedCurrency = currency.toUpperCase().replace(/[^A-Z]/g, '');
  
  if (normalizedCurrency === 'INR') {
    if (amount >= 10000000) { // 1 crore
      return `₹${(amount / 10000000).toFixed(2)} crore`;
    } else if (amount >= 100000) { // 1 lakh
      return `₹${(amount / 100000).toFixed(2)} lakh`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  } else if (normalizedCurrency === 'USD') {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount.toLocaleString('en-US')}`;
    }
  } else if (normalizedCurrency === 'AED') {
    // Example for AED (Emirati Dirham)
    if (amount >= 1000000) {
      return `AED ${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `AED ${(amount / 1000).toFixed(2)}K`;
    } else {
      return `AED ${amount.toLocaleString('en-AE')}`;
    }
  }
  
  // For other currencies, use Intl.NumberFormat with the normalized currency code
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: normalizedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  } catch (error) {
    // Fallback to basic formatting if currency code is invalid
    console.warn(`Invalid currency code: ${currency}, falling back to basic formatting`);
    return `${amount.toLocaleString()}`;
  }
}
