type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(page - 3, 0),
    Math.max(page - 3, 0) + 5,
  );

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Properties pagination">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-40"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`rounded-md border px-3 py-2 text-sm ${
            p === page ? 'bg-[var(--color-foreground)] text-[var(--color-background)]' : ''
          }`}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
