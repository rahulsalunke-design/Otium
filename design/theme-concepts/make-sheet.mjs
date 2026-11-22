// Builds index.html: a comparison sheet of Otium theme concepts, using the
// real-panel screenshots in shots/ (captured with each theme's colours applied).
// Run from the project root:  node design/theme-concepts/make-sheet.mjs
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { THEMES, HIGH_CONTRAST } from './themes.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const img = (file, w = 200) => `<img src="shots/${file}" width="${w}" alt="">`
const chip = (c, label) => `<span class="sw"><i style="background:${c}"></i>${label}</span>`

const themeRows = THEMES.map((t) => `
  <div class="trow">
    <div class="tinfo">
      <h3>${t.name}${t.key === 'sage' ? ' <em>current</em>' : ''}</h3>
      <p class="tag">${t.tag}</p>
      <p class="mood">${t.mood}</p>
      <div class="sws">${chip(t.light['--accent'], 'accent')}${chip(t.light['--bg'], 'light')}${chip(t.dark['--bg'], 'dark')}</div>
    </div>
    <figure>${img(`${t.key}-list-light.png`)}<figcaption>List · light</figcaption></figure>
    <figure>${img(`${t.key}-list-dark.png`)}<figcaption>List · dark</figcaption></figure>
    <figure>${img(`${t.key}-glance-light.png`)}<figcaption>Glance · light</figcaption></figure>
    <figure>${img(`${t.key}-glance-dark.png`)}<figcaption>Glance · dark</figcaption></figure>
  </div>`).join('')

const extra = (title, tag, mood, a, b) => `
  <div class="xcard">
    <h3>${title}</h3><p class="tag">${tag}</p><p class="mood">${mood}</p>
    <div class="pair"><figure>${img(a, 180)}<figcaption>light</figcaption></figure><figure>${img(b, 180)}<figcaption>dark</figcaption></figure></div>
  </div>`

const swatchGrid = THEMES.map((t, i) => `
  <span class="opt ${i === 1 ? 'sel' : ''}"><span class="dot" style="background:linear-gradient(135deg, ${t.light['--bg']} 0 50%, ${t.dark['--bg']} 50% 100%)">
    <span class="ac" style="background:${t.light['--accent']}"></span></span>${t.name}</span>`).join('')

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Otium · theme concepts</title>
<style>
  * { box-sizing:border-box; }
  body { margin:0; padding:48px; width:1440px; background:#F4F4F1; color:#1D1D1F; font:14px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; -webkit-font-smoothing:antialiased; }
  h1 { margin:0 0 4px; font-size:30px; letter-spacing:-.01em; } .lede { margin:0 0 34px; color:#6E6E73; max-width:900px; }
  h2 { margin:40px 0 6px; font-size:20px; } .sub { margin:0 0 18px; color:#6E6E73; }
  .trow { display:grid; grid-template-columns: 300px repeat(4, 200px); gap:26px; align-items:start; padding:22px; margin-bottom:14px; background:#fff; border:1px solid #E7E7E3; border-radius:18px; }
  h3 { margin:0; font-size:18px; } h3 em { font-style:normal; font-size:11px; font-weight:600; color:#4f7f6f; background:#e8efec; padding:2px 7px; border-radius:10px; vertical-align:middle; }
  .tag { margin:2px 0 8px; font-size:12px; font-weight:600; color:#8a8a8f; text-transform:uppercase; letter-spacing:.05em; }
  .mood { margin:0 0 12px; color:#3a3a3c; font-size:13px; }
  .sws { display:flex; gap:10px; flex-wrap:wrap; } .sw { display:flex; align-items:center; gap:5px; font-size:11px; color:#6E6E73; }
  .sw i { width:16px; height:16px; border-radius:50%; border:1px solid rgba(0,0,0,.12); }
  figure { margin:0; } figure img { display:block; border-radius:12px; box-shadow:0 8px 22px rgba(0,0,0,.14); }
  figcaption { margin-top:7px; font-size:11px; color:#8a8a8f; text-align:center; }
  .xgrid { display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; }
  .xcard { padding:22px; background:#fff; border:1px solid #E7E7E3; border-radius:18px; }
  .pair { display:flex; gap:14px; }
  .day { display:flex; align-items:flex-start; gap:18px; padding:22px; background:#fff; border:1px solid #E7E7E3; border-radius:18px; }
  .day figure { text-align:center; } .day figcaption b { display:block; color:#1D1D1F; font-size:13px; }
  .arrow { align-self:center; color:#a1a1a6; font-size:24px; }
  .daynote { flex:1; align-self:center; padding-left:12px; color:#3a3a3c; }
  /* Settings mock (Sage, dark) */
  .mockwrap { display:flex; gap:32px; align-items:flex-start; }
  .mock { width:320px; background:#1c1c1e; color:#f2f2f2; border-radius:12px; padding:12px; box-shadow:0 14px 40px rgba(0,0,0,.35); font-size:13px; }
  .mhdr { display:flex; align-items:center; justify-content:space-between; padding:0 4px 10px; font-weight:600; }
  .mhdr span { color:#98989d; font-weight:400; }
  .mcard { background:#262628; border:1px solid #333336; border-radius:12px; padding:14px; display:flex; flex-direction:column; gap:12px; }
  .gt { font-size:11px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:#98989d; }
  .themes { display:grid; grid-template-columns:repeat(4, 1fr); gap:10px 6px; }
  .opt { display:flex; flex-direction:column; align-items:center; gap:4px; font-size:11px; color:#c7c7cc; }
  .dot { position:relative; width:36px; height:36px; border-radius:50%; border:1px solid rgba(255,255,255,.18); }
  .dot .ac { position:absolute; right:-2px; bottom:-2px; width:14px; height:14px; border-radius:50%; border:2px solid #262628; }
  .opt.sel .dot { box-shadow:0 0 0 2px #262628, 0 0 0 4px #e9a07a; } .opt.sel { color:#fff; font-weight:600; }
  .line { display:flex; align-items:center; justify-content:space-between; }
  .seg { display:flex; padding:2px; border-radius:8px; background:rgba(255,255,255,.07); }
  .seg b { font-weight:500; padding:3px 10px; border-radius:6px; color:#98989d; font-size:12px; } .seg b.on { background:#3a3a3c; color:#fff; }
  .sw2 { width:30px; height:18px; border-radius:9px; background:#38383b; position:relative; } .sw2::after { content:''; position:absolute; top:2px; left:2px; width:14px; height:14px; border-radius:50%; background:#fff; }
  .sw2.on { background:#e9a07a; } .sw2.on::after { left:14px; }
  .hint { font-size:11px; color:#6a6a6f; margin-top:-6px; }
  .mocknote { flex:1; color:#3a3a3c; } .mocknote li { margin:6px 0; }
</style></head><body>
  <h1>Otium · theme concepts</h1>
  <p class="lede">Every screenshot is the real Otium panel with the theme’s colours applied, not a drawing. Same moment in each: about 21 minutes in, Eye break has just gone off (Snooze showing) and Stretch is paused. Each theme has a light and a dark version and still follows the Mac’s appearance.</p>

  <h2>1 · Colour themes</h2>
  <p class="sub">Seven palettes. Each changes the background, surfaces, text tones and one accent colour (rings, buttons, Snooze).</p>
  ${themeRows}

  <h2>2 · Beyond colour</h2>
  <p class="sub">Options that change the feel more than the palette does.</p>
  <div class="xgrid">
    ${extra(HIGH_CONTRAST.name, HIGH_CONTRAST.tag, HIGH_CONTRAST.mood, 'contrast-list-light.png', 'contrast-list-dark.png')}
    ${extra('Glass', 'Native macOS feel', 'A frosted, translucent panel that lets the desktop colours show through, like Control Center. (Simulated here over a sample wallpaper.)', 'glass-list-light.png', 'glass-list-dark.png')}
    ${extra('Serif typeface', 'Editorial, Roman', 'The same panel set in a serif (Apple’s New York, falling back to Iowan Old Style). Fits the Latin name. A rounded face was explored too but would need a bundled font.', 'font-serif-list-light.png', 'font-serif-list-dark.png')}
  </div>

  <h2>3 · Follow the day</h2>
  <p class="sub">An optional mode unique to Otium: the theme shifts with the time of day, echoing the app icon.</p>
  <div class="day">
    <figure>${img('dawn-list-light.png', 210)}<figcaption><b>Morning · Dawn</b>until 11:00</figcaption></figure><span class="arrow">→</span>
    <figure>${img('sage-list-light.png', 210)}<figcaption><b>Midday · Sage</b>11:00–17:00</figcaption></figure><span class="arrow">→</span>
    <figure>${img('dusk-list-dark.png', 210)}<figcaption><b>Evening · Dusk</b>after 17:00</figcaption></figure>
    <p class="daynote">The panel changes gently over the day, so a glance also tells you what part of the day it is, and the evening palette is warmer and dimmer as you wind down.</p>
  </div>

  <h2>4 · Where you’d choose it: Settings → Appearance</h2>
  <p class="sub">A proposed new section at the top of Settings (mock-up shown in Sage dark, with Dusk selected).</p>
  <div class="mockwrap">
    <div class="mock">
      <div class="mhdr">‹ <span>Settings</span> ⏻</div>
      <div class="mcard">
        <div class="gt">Appearance</div>
        <div class="themes">${swatchGrid}<span class="opt"><span class="dot" style="background:conic-gradient(#fdf6f5 0 33%, #f7f7f5 0 66%, #221c22 0)"></span>Follow day</span></div>
        <div class="line"><span>Mode</span><span class="seg"><b class="on">System</b><b>Light</b><b>Dark</b></span></div>
        <div class="line"><span>Glass background</span><span class="sw2"></span></div>
        <div class="line"><span>Typeface</span><span class="seg"><b class="on">Default</b><b>Serif</b></span></div>
        <div class="line"><span>High contrast</span><span class="sw2"></span></div>
        <p class="hint">Changes preview instantly.</p>
      </div>
    </div>
    <ul class="mocknote">
      <li><b>Theme swatches:</b> each circle shows its light and dark background, with the accent dot. Clicking one previews it immediately.</li>
      <li><b>Follow day</b> sits with the swatches, as a theme of its own.</li>
      <li><b>Mode:</b> System follows macOS; Light and Dark override it just for Otium.</li>
      <li><b>Glass, Typeface, High contrast</b> work on top of any theme.</li>
      <li>The menu bar icon, notifications and app icon stay as macOS draws them.</li>
    </ul>
  </div>
</body></html>`

writeFileSync(join(HERE, 'index.html'), html)
console.log('wrote index.html')
