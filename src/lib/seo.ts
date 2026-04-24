import { siteConfig } from '@/config/site';

export type SEOInput = {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
};

export function buildCanonical(pathname = '/') {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(normalizedPath, siteConfig.url).toString();
}

export function buildSEOMetadata(input: SEOInput = {}) {
  const title = input.title ? `${input.title} | ${siteConfig.name}` : siteConfig.name;
  const description = input.description ?? siteConfig.description;
  const image = input.image ?? siteConfig.ogImage;
  const canonical = input.canonical ?? buildCanonical('/');

  return {
    title,
    description,
    image,
    canonical,
    noindex: input.noindex ?? false,
  };
}
