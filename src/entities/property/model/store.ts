import { create } from 'zustand';

import { getProperties } from '@/entities/property/api/properties.api';
import {
  OWNERSHIP_TYPE,
  PROPERTY_SOURCE,
  PROPERTY_STATUS,
  PROPERTY_TYPE,
  type PropertyFilters,
  type PropertyListItem,
  type PropertyResponse,
} from '@/entities/property/model/types';
import { buildCleanQuery } from '@/shared/lib/query';

type PropertyStore = {
  properties: PropertyListItem[];
  loading: boolean;
  error: string | null;
  filters: PropertyFilters;
  pagination: {
    page: number;
    limit: number;
  };
  total: number;
  totalPages: number;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  setPage: (page: number) => void;
  syncFromUrl: (search: string) => void;
  hydrate: (payload: { response: PropertyResponse; filters: PropertyFilters }) => void;
  fetchProperties: () => Promise<void>;
};

const initialFilters: PropertyFilters = {
  page: 1,
  limit: 9,
};

function parseNumericParam(value: string | null) {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

function parseEnumValue<T extends readonly string[]>(value: string | null, source: T) {
  if (!value) return undefined;
  return source.includes(value) ? (value as T[number]) : undefined;
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: [],
  loading: false,
  error: null,
  filters: initialFilters,
  pagination: {
    page: 1,
    limit: 9,
  },
  total: 0,
  totalPages: 1,
  setFilters: (next) => {
    set((state) => {
      const merged = buildCleanQuery({
        ...state.filters,
        ...next,
      });
      return {
        filters: {
          ...merged,
          page: next.page ?? 1,
          limit: Number(merged.limit ?? state.pagination.limit),
        },
      };
    });
  },
  setPage: (page) => {
    set((state) => ({
      filters: {
        ...state.filters,
        page,
      },
    }));
  },
  syncFromUrl: (search) => {
    const params = new URLSearchParams(search);
    set((state) => ({
      filters: buildCleanQuery({
        ...state.filters,
        q: params.get('q') ?? undefined,
        location: params.get('location') ?? undefined,
        status: parseEnumValue(params.get('status'), PROPERTY_STATUS),
        type: parseEnumValue(params.get('type'), PROPERTY_TYPE),
        ownershipType: parseEnumValue(params.get('ownershipType'), OWNERSHIP_TYPE),
        source: parseEnumValue(params.get('source'), PROPERTY_SOURCE),
        priceFrom: parseNumericParam(params.get('priceFrom')),
        priceTo: parseNumericParam(params.get('priceTo')),
        bedroomsFrom: parseNumericParam(params.get('bedroomsFrom')),
        bedroomsTo: parseNumericParam(params.get('bedroomsTo')),
        bathroomsFrom: parseNumericParam(params.get('bathroomsFrom')),
        bathroomsTo: parseNumericParam(params.get('bathroomsTo')),
        page: parseNumericParam(params.get('page')) ?? 1,
        limit: parseNumericParam(params.get('limit')) ?? state.pagination.limit,
      }),
    }));
  },
  hydrate: ({ response, filters }) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
      properties: response.data,
      total: response.meta.total,
      totalPages: response.meta.totalPages,
      pagination: {
        page: response.meta.page,
        limit: response.meta.limit,
      },
      error: null,
      loading: false,
    }));
  },
  fetchProperties: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const response = await getProperties(filters);
      set({
        properties: response.data,
        loading: false,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
        pagination: {
          page: response.meta.page,
          limit: response.meta.limit,
        },
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load properties',
      });
    }
  },
}));
