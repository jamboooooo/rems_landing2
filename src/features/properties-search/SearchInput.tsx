type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name, location, developer"
      aria-label="Search properties"
      className="h-11 w-full rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-background)_88%,white)] px-4 text-sm text-[var(--color-foreground)] shadow-sm transition outline-none placeholder:text-[var(--color-muted-foreground)] focus-visible:border-[color-mix(in_srgb,var(--color-primary)_55%,var(--color-border))] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
    />
  );
}
