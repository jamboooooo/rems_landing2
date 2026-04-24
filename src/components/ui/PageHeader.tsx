import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn('space-y-3', className)}>
      <h1 className="text-[length:var(--text-h1)] leading-tight font-semibold text-balance">
        {title}
      </h1>
      {description ? (
        <p className="max-w-3xl text-base text-[var(--color-muted-foreground)]">{description}</p>
      ) : null}
    </header>
  );
}
