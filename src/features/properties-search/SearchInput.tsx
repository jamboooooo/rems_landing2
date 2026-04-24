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
      className="h-11 w-full rounded-xl border border-[var(--color-input)] bg-white px-4 text-sm transition outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
    />
  );
}
