import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { usePropertyStore } from '@/entities/property/model/store';
import type { PropertyFilters, PropertyResponse } from '@/entities/property/model/types';
import { useUrlQuerySync } from '@/shared/hooks/useUrlQuerySync';
import { PropertiesFilters } from '@/widgets/properties-filters/PropertiesFilters';
import { PropertiesGrid } from '@/widgets/properties-grid/PropertiesGrid';
import { PropertiesGridSkeleton } from '@/widgets/properties-grid/PropertiesGridSkeleton';
import { PropertiesResultsState } from '@/widgets/properties-grid/PropertiesResultsState';
import { PropertiesPagination } from '@/widgets/properties-pagination/PropertiesPagination';

type PropertiesCatalogIslandProps = {
  initialFilters: PropertyFilters;
  initialResponse: PropertyResponse;
};

export function PropertiesCatalogIsland({
  initialFilters,
  initialResponse,
}: PropertiesCatalogIslandProps) {
  const {
    filters,
    loading,
    error,
    properties,
    total,
    pagination,
    totalPages,
    setFilters,
    setPage,
    hydrate,
    fetchProperties,
  } = usePropertyStore();
  const hydratedRef = useRef(false);
  const skipFirstFetchRef = useRef(true);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydrate({
      filters: initialFilters,
      response: initialResponse,
    });
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (skipFirstFetchRef.current) {
      skipFirstFetchRef.current = false;
      return;
    }
    void fetchProperties();
  }, [fetchProperties, filters]);

  useUrlQuerySync(filters);

  return (
    <section className="min-h-[calc(100vh-8rem)] pb-20">
      <div className="container space-y-6">
        <PropertiesFilters filters={filters} onChange={setFilters} />

        <header className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {loading ? 'Loading properties...' : `${total} properties found`}
          </p>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Page {pagination.page} of {totalPages}
          </p>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${loading}-${pagination.page}-${total}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {loading ? (
              <PropertiesGridSkeleton />
            ) : error ? (
              <PropertiesResultsState
                type="error"
                message={error}
                onRetry={() => void fetchProperties()}
              />
            ) : properties.length === 0 ? (
              <PropertiesResultsState type="empty" />
            ) : (
              <PropertiesGrid properties={properties} />
            )}
          </motion.div>
        </AnimatePresence>

        <PropertiesPagination page={pagination.page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  );
}
