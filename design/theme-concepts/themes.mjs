// Otium theme concepts: each theme is a set of the app's colour tokens,
// with a light and a dark version (it still follows the Mac's appearance).

const soft = (hex, a) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

function palette({ bg, surface, border, text, muted, faint, track, accent, accentText, hover }, dark) {
  return {
    '--bg': bg,
    '--surface': surface,
    '--border': border,
    '--text': text,
    '--muted': muted,
    '--faint': faint,
    '--track': track,
    '--accent': accent,
    '--accent-hover': accent,
    '--accent-text': accentText,
    '--accent-soft': soft(accent, dark ? 0.16 : 0.12),
    '--focus': soft(accent, 0.45),
    '--glow': soft(accent, dark ? 0.32 : 0.28),
    '--hover': hover ?? (dark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)')
  }
}

export const THEMES = [
  {
    key: 'sage', name: 'Sage', tag: 'Today’s default', mood: 'Calm and natural, sage on warm neutrals.',
    light: palette({ bg: '#f7f7f5', surface: '#ffffff', border: '#e7e7e3', text: '#1d1d1f', muted: '#6e6e73', faint: '#a1a1a6', track: '#ecece8', accent: '#4f7f6f', accentText: '#ffffff' }),
    dark: palette({ bg: '#1c1c1e', surface: '#262628', border: '#333336', text: '#f2f2f2', muted: '#98989d', faint: '#6a6a6f', track: '#38383b', accent: '#7fb09f', accentText: '#13201c' }, true)
  },
  {
    key: 'dusk', name: 'Dusk', tag: 'Matches the app icon', mood: 'Warm end-of-day light: terracotta on cream, deep plum-grey at night.',
    light: palette({ bg: '#faf5f0', surface: '#fffdfb', border: '#efe4da', text: '#2a1f1a', muted: '#7a6a62', faint: '#b3a59c', track: '#f1e6dc', accent: '#c26a43', accentText: '#ffffff' }),
    dark: palette({ bg: '#221c22', surface: '#2c2530', border: '#3b3240', text: '#f4ece6', muted: '#a8989f', faint: '#75666e', track: '#3d3442', accent: '#e9a07a', accentText: '#2a1810' }, true)
  },
  {
    key: 'dawn', name: 'Dawn', tag: 'Soft and fresh', mood: 'Morning blush: rose on very light pink.',
    light: palette({ bg: '#fdf6f5', surface: '#ffffff', border: '#f2e3e1', text: '#2b2224', muted: '#806e71', faint: '#b8a6a9', track: '#f6e7e5', accent: '#c96a7e', accentText: '#ffffff' }),
    dark: palette({ bg: '#1f1b1e', surface: '#2a2428', border: '#3a3136', text: '#f6eef0', muted: '#ab9ba0', faint: '#77686d', track: '#3c3338', accent: '#f0a3b1', accentText: '#2b1419' }, true)
  },
  {
    key: 'travertine', name: 'Travertine', tag: 'Roman stone', mood: 'Quiet luxury: olive on warm beige stone.',
    light: palette({ bg: '#f1ece2', surface: '#f9f6ef', border: '#e2d9c8', text: '#2b2a24', muted: '#746d5f', faint: '#aaa292', track: '#e7dfcf', accent: '#6c7745', accentText: '#ffffff' }),
    dark: palette({ bg: '#22201b', surface: '#2c2a24', border: '#3b3830', text: '#eee8dc', muted: '#a79f8e', faint: '#736c5e', track: '#3d3a31', accent: '#b3bd86', accentText: '#1e2110' }, true)
  },
  {
    key: 'tide', name: 'Tide', tag: 'Cool and focused', mood: 'Blue-teal on cool greys, for deep-work days.',
    light: palette({ bg: '#f4f7f9', surface: '#ffffff', border: '#e1e8ee', text: '#1b2126', muted: '#66727c', faint: '#a0aab3', track: '#e6edf2', accent: '#33769f', accentText: '#ffffff' }),
    dark: palette({ bg: '#171c20', surface: '#20272c', border: '#2e373e', text: '#eef3f6', muted: '#94a2ad', faint: '#64717b', track: '#313b43', accent: '#7bb6db', accentText: '#0f2230' }, true)
  },
  {
    key: 'lavender', name: 'Lavender', tag: 'Evening wind-down', mood: 'Muted violet on soft lilac-grey.',
    light: palette({ bg: '#f7f6fa', surface: '#ffffff', border: '#e6e3ef', text: '#221f2b', muted: '#6f6a80', faint: '#a7a2b8', track: '#ebe8f2', accent: '#7563ae', accentText: '#ffffff' }),
    dark: palette({ bg: '#1c1b22', surface: '#26242e', border: '#35323f', text: '#f1eff7', muted: '#a09bb3', faint: '#6d687f', track: '#383541', accent: '#b4a6e6', accentText: '#1d1833' }, true)
  },
  {
    key: 'graphite', name: 'Graphite', tag: 'No colour', mood: 'Pure neutrals for people who don’t want colour.',
    light: palette({ bg: '#f5f5f5', surface: '#ffffff', border: '#e5e5e5', text: '#111111', muted: '#6b6b6b', faint: '#a3a3a3', track: '#ebebeb', accent: '#2b2b2b', accentText: '#ffffff', hover: 'rgba(0, 0, 0, 0.05)' }),
    dark: palette({ bg: '#161616', surface: '#1f1f1f', border: '#2e2e2e', text: '#f5f5f5', muted: '#9a9a9a', faint: '#666666', track: '#333333', accent: '#e6e6e6', accentText: '#111111' }, true)
  }
]

// Extras explored beyond colour.
export const HIGH_CONTRAST = {
  key: 'contrast', name: 'High contrast', tag: 'Accessibility', mood: 'Stronger text, borders and rings. Could follow macOS “Increase contrast”.',
  light: palette({ bg: '#ffffff', surface: '#ffffff', border: '#8e8e93', text: '#000000', muted: '#3a3a3c', faint: '#5c5c60', track: '#c7c7cc', accent: '#2c5a4b', accentText: '#ffffff' }),
  dark: palette({ bg: '#000000', surface: '#161618', border: '#8e8e93', text: '#ffffff', muted: '#d1d1d6', faint: '#aeaeb2', track: '#48484a', accent: '#9fd4c1', accentText: '#000000' }, true)
}

/** CSS that applies a theme's tokens, overriding the app's built-in ones. */
export function themeCss(t) {
  const block = (vars) => Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join(' ')
  return `:root { ${block(t.light)} } @media (prefers-color-scheme: dark) { :root { ${block(t.dark)} } }`
}

/** Simulated macOS "Glass": a frosted, translucent panel over the desktop. */
export const GLASS_CSS = `
  html { background:
    radial-gradient(60% 50% at 15% 20%, #7aa2ff 0%, transparent 70%),
    radial-gradient(50% 45% at 85% 30%, #f6a77d 0%, transparent 70%),
    radial-gradient(70% 60% at 50% 100%, #8fd3b8 0%, transparent 70%), #8a8fb5 !important; }
  body, .panel { background: transparent !important; }
  .panel { backdrop-filter: blur(28px) saturate(1.7); -webkit-backdrop-filter: blur(28px) saturate(1.7);
           background: rgba(246, 246, 244, 0.62) !important; min-height: 100vh; }
  .list, .glance-tile, .settings, .empty { background: rgba(255, 255, 255, 0.55) !important; border-color: rgba(255, 255, 255, 0.6) !important; }
  @media (prefers-color-scheme: dark) {
    html { background:
      radial-gradient(60% 50% at 15% 20%, #2b3e7a 0%, transparent 70%),
      radial-gradient(50% 45% at 85% 30%, #6e3b2a 0%, transparent 70%),
      radial-gradient(70% 60% at 50% 100%, #1f5545 0%, transparent 70%), #1d2033 !important; }
    .panel { background: rgba(28, 28, 30, 0.58) !important; }
    .list, .glance-tile, .settings, .empty { background: rgba(255, 255, 255, 0.06) !important; border-color: rgba(255, 255, 255, 0.1) !important; }
  }`

// A rounded typeface was explored too, but Apple's rounded system font isn't
// available to the app's web engine; it would need a bundled open-source
// font (e.g. Nunito). Serif uses fonts that ship with macOS.
export const FONTS = {
  serif: `:root, button, input, select { font-family: ui-serif, "New York", "Iowan Old Style", Charter, Georgia, serif !important; }
          .wordmark { letter-spacing: 0 !important; }`
}
