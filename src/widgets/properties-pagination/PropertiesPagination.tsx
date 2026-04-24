import { PaginationControls } from '@/features/properties-pagination/PaginationControls';

type PropertiesPaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function PropertiesPagination({ page, totalPages, onChange }: PropertiesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pt-2">
      <PaginationControls page={page} totalPages={totalPages} onPageChange={onChange} />
    </div>
  );
}
