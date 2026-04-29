import type { AxiosError } from 'axios';

import { apiClient } from '@/shared/api/client';
import { buildCleanQuery } from '@/shared/lib/query';

export type ApiSuccess<T> = {
  data: T;
};

export type ApiError = {
  message: string;
  status?: number;
};

export async function getRequest<TResponse, TQuery extends Record<string, unknown>>(
  url: string,
  query?: TQuery,
): Promise<TResponse> {
  try {
    const response = await apiClient.get<TResponse>(url, {
      params: query ? buildCleanQuery(query) : undefined,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw {
      message: axiosError.response?.data?.message ?? 'Request failed',
      status: axiosError.response?.status,
    } satisfies ApiError;
  }
}
