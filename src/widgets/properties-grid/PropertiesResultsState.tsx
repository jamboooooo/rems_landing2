type PropertiesResultsStateProps = {
  type: 'error' | 'empty';
  message?: string;
  onRetry?: () => void;
};

export function PropertiesResultsState({ type, message, onRetry }: PropertiesResultsStateProps) {
  if (type === 'error') {
    return (
      <div className="rounded-2xl border bg-red-50 p-6 text-center">
        <p className="font-medium text-red-700">{message ?? 'Failed to load properties.'}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-[var(--color-card)] p-8 text-center">
      <p className="font-medium">No properties found</p>
      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
        Try broadening your search or removing some filters.
      </p>
    </div>
  );
}
