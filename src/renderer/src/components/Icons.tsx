// Small inline icons, sized and coloured by the surrounding text.
const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  'aria-hidden': true,
  focusable: false
} as const

export const PlayIcon = () => (
  <svg {...base}>
    <path d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.4-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z" fill="currentColor" />
  </svg>
)

export const PauseIcon = () => (
  <svg {...base}>
    <rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" />
    <rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" />
  </svg>
)

export const ResetIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8a5 5 0 1 0 1.6-3.7" />
    <path d="M3 2.5v2.8h2.8" />
  </svg>
)

export const PlusIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M8 3.5v9M3.5 8h9" />
  </svg>
)

export const PowerIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M8 2.2v5.3" />
    <path d="M4.9 4.3a5 5 0 1 0 6.2 0" />
  </svg>
)

export const BackIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3 5 8l5 5" />
  </svg>
)
