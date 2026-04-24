import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ContainerProps<T extends ElementType = 'div'> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function Container<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? 'div';
  return (
    <Component className={cn('container', className)} {...props}>
      {children}
    </Component>
  );
}
