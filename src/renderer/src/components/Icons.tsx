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

export const SettingsIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M2.5 4.5h11M2.5 11.5h11" />
    <circle cx="10.5" cy="4.5" r="1.8" fill="var(--bg)" />
    <circle cx="5.5" cy="11.5" r="1.8" fill="var(--bg)" />
  </svg>
)

export const PlusIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M8 3.5v9M3.5 8h9" />
  </svg>
)

export const TrashIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.1a1 1 0 0 0 1 .9h3.8a1 1 0 0 0 1-.9l.6-8.1" />
  </svg>
)

export const BackIcon = () => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3 5 8l5 5" />
  </svg>
)
