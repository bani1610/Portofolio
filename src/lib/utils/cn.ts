import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names, letting later Tailwind utilities win over earlier
 * ones of the same kind. Without twMerge, `cn('p-2', 'p-4')` would emit
 * both and leave the winner to CSS source order.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
