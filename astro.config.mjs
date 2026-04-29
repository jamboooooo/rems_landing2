// @ts-check
import { defineConfig } from 'astro/config';
import path from 'node:path';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://example-estate.com',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react(), sitemap(), compress()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
});
