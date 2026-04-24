import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';
import { z, type ZodType } from 'zod';

export function createFormSchema<T extends ZodType>(schema: T) {
  return schema;
}

export function createZodResolver<TValues extends Record<string, unknown>>(
  schema: z.ZodSchema<TValues>,
): Resolver<TValues> {
  return zodResolver(schema as never) as Resolver<TValues>;
}
