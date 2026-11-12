import { useEffect, useState } from 'react'

export const themeStorageKey = 'transformer-atlas-theme'
export const progressStorageKey = 'transformer-atlas-done'

export type ThemeName = 'dark' | 'light'

function isStorageError(error: unknown): boolean {
  return error instanceof DOMException
}

export function readTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(themeStorageKey)
    if (stored === 'light' || stored === 'dark') return stored
    return 'dark'
  } catch (error) {
    if (isStorageError(error)) return 'dark'
    throw error
  }
}

export function applyTheme(theme: ThemeName): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('scheme-dark', theme === 'dark')
  root.classList.toggle('scheme-light', theme === 'light')
  try {
    localStorage.setItem(themeStorageKey, theme)
  } catch (error) {
    if (isStorageError(error)) return
    throw error
  }
}

export function readDone(): string[] {
  try {
    const raw = localStorage.getItem(progressStorageKey)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch (error) {
    if (isStorageError(error) || error instanceof SyntaxError) return []
    throw error
  }
}

export function writeDone(done: readonly string[]): void {
  try {
    localStorage.setItem(progressStorageKey, JSON.stringify(done))
  } catch (error) {
    if (isStorageError(error)) return
    throw error
  }
}

export function readRoute(ids: readonly string[]): string {
  const match = /^#\/learn\/([\w-]+)/.exec(location.hash)
  const id = match?.[1]
  if (id && ids.includes(id)) return id
  return 'home'
}

export function useThemeKey(): string {
  const [key, setKey] = useState(() => document.documentElement.className)
  useEffect(() => {
    const observer = new MutationObserver(() => setKey(document.documentElement.className))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return key
}

export function useColorMode(): ThemeName {
  const key = useThemeKey()
  return key.split(/\s+/).includes('dark') ? 'dark' : 'light'
}
