/// <reference types="vite/client" />

declare global {
  interface Window {
    MathJax?: {
      startup?: { promise?: Promise<unknown> }
      tex2svg: (tex: string, options: { display: boolean }) => Element
      svgStylesheet?: () => HTMLStyleElement
    }
  }
}

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  export const frontmatter: unknown
  const content: ComponentType
  export default content
}

export {}
