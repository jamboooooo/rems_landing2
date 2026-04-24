import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-md)] text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90',
        secondary:
          'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:opacity-90',
        ghost: 'hover:bg-[var(--color-muted)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-[var(--radius-sm)] px-3',
        lg: 'h-11 rounded-[var(--radius-lg)] px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
