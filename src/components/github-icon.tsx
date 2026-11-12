import { type JSX } from 'react'

export function GithubIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.3-.4 6.7-1.6 6.7-7.4A5.8 5.8 0 0 0 20 4.1 5.4 5.4 0 0 0 19.9 0S18.6-.4 16 1.5a13.8 13.8 0 0 0-8 0C5.4-.4 4.1 0 4.1 0A5.4 5.4 0 0 0 4 4.1a5.8 5.8 0 0 0-1.7 4.1c0 5.8 3.4 7 6.7 7.4a3.4 3.4 0 0 0-1 2.6V22" />
    </svg>
  )
}
