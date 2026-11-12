import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: './',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      }),
    },
    react({ include: /\.(js|jsx|mdx|ts|tsx)$/ }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
    },
  },
  server: { host: '0.0.0.0', port: 5173 },
})
