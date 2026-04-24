/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
