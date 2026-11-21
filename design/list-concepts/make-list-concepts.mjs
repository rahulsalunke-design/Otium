// Mockups of compact List view layouts for Otium, using the app's real icons
// and colours. Writes index.html next to this script.
// Run from the project root:  node design/list-concepts/make-list-concepts.mjs
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Bell, Eye, GlassWater, LayoutGrid, List, Move, Pause, Play, Power, RotateCcw, SlidersHorizontal
} from 'lucide-react'

const HERE = dirname(fileURLToPath(import.meta.url))
const svg = (Icon, size = 16, extra = {}) =>
  renderToStaticMarkup(createElement(Icon, { size, strokeWidth: 1.75, 'aria-hidden': true, ...extra }))

// The same four reminders in every option, covering the three states that matter.
const R = [
  { name: 'Water', icon: GlassWater, every: 60, time: '50:28', mins: '51 min', p: 0.84, next: '18:10', state: 'running' },
  { name: 'Eye break', icon: Eye, every: 20, time: '10:28', mins: '11 min', p: 0.52, next: '17:30', state: 'running' },
  { name: 'Stretch', icon: Move, every: 30, time: '29:52', mins: '30 min', p: 0.99, next: '17:50', state: 'fired' },
  { name: 'Test123', icon: Bell, every: 30, time: '20:28', mins: '21 min', p: 0.68, next: '', state: 'paused' }
]

const header = `
  <div class="hdr"><b>Otium</b><span class="acts">
    <span class="seg"><i class="on">${svg(List, 14)}</i><i>${svg(LayoutGrid, 14)}</i></span>
    <i>${svg(SlidersHorizontal, 15)}</i><i>${svg(Power, 15)}</i></span></div>`

const btn = (r, cls = 'pbtn') => `<span class="${cls}">${svg(r.state === 'paused' ? Play : Pause, 14, { fill: 'currentColor', strokeWidth: 1 })}</span>`
const status = (r) => (r.state === 'paused' ? 'Paused' : `Next at ${r.next}`)
const ringSvg = (p, size, stroke, idle) => {
  const rad = (size - stroke) / 2
  const c = 2 * Math.PI * rad
  return `<svg class="mring" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${rad}" fill="none" stroke="var(--track)" stroke-width="${stroke}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${rad}" fill="none" stroke="${idle ? 'var(--faint)' : 'var(--accent)'}" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p)}" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`
}

// ---------------------------------------------------------------- options

const current = () => R.map((r) => `
  <div class="card ${r.state === 'paused' ? 'idle' : ''}">
    <div class="ctop"><span class="chip">${svg(r.icon, 15)}</span><b>${r.name}</b><span class="faint">every ${r.every} min</span>
      <span class="sp"></span><span class="ib">${svg(RotateCcw, 15)}</span>${btn(r)}</div>
    <div class="big">${r.time}</div>
    <div class="bar"><div style="width:${r.p * 100}%"></div></div>
    <div class="cbot"><span class="muted sm">${status(r)}</span>${r.state === 'fired' ? '<span class="link">Snooze 5 min</span>' : ''}</div>
  </div>`).join('')

const compact = () => `<div class="group">${R.map((r) => `
  <div class="row b ${r.state === 'paused' ? 'idle' : ''}">
    <span class="chip">${svg(r.icon, 14)}</span>
    <span class="name">${r.name}</span>
    ${r.state === 'fired' ? '<span class="pill">Snooze</span>' : ''}
    <span class="sp"></span>
    <span class="t ${r.state === 'paused' ? 'muted' : ''}">${r.state === 'paused' ? 'Paused' : r.time}</span>
    ${btn(r, 'pbtn sm')}
    <div class="uline"><div style="width:${r.p * 100}%"></div></div>
  </div>`).join('')}</div>`

const twoLine = () => `<div class="group">${R.map((r) => `
  <div class="row c ${r.state === 'paused' ? 'idle' : ''}">
    <span class="chip lg">${svg(r.icon, 16)}</span>
    <div class="mid">
      <div class="l1"><span class="name">${r.name}</span><span class="sp"></span><span class="t lg">${r.time}</span></div>
      <div class="l2"><div class="bar thin"><div style="width:${r.p * 100}%"></div></div>
        ${r.state === 'fired' ? '<span class="link sm">Snooze 5 min</span>' : `<span class="faint xs">${r.state === 'paused' ? 'Paused' : `next ${r.next}`}</span>`}</div>
    </div>
    ${btn(r, 'pbtn sm')}
  </div>`).join('')}</div>`

const ringRow = () => `<div class="group">${R.map((r, i) => `
  <div class="row d ${r.state === 'paused' ? 'idle' : ''} ${i === 1 ? 'hover' : ''}">
    <span class="rwrap">${ringSvg(r.p, 34, 3, r.state === 'paused')}<span class="ric">${svg(r.icon, 15)}</span><span class="rhov">${svg(Pause, 13, { fill: 'currentColor', strokeWidth: 1 })}</span></span>
    <div class="mid">
      <span class="name">${r.name}</span>
      ${r.state === 'fired' ? '<span class="link sm">Snooze 5 min</span>' : `<span class="faint xs">${r.state === 'paused' ? 'Paused' : `every ${r.every} min · next ${r.next}`}</span>`}
    </div>
    <span class="t lg ${r.state === 'paused' ? 'muted' : ''}">${r.time}</span>
  </div>`).join('')}</div>`

const fillRow = () => `<div class="stack">${R.map((r) => `
  <div class="row e ${r.state === 'paused' ? 'idle' : ''}">
    <div class="fill" style="width:${r.p * 100}%"></div>
    <span class="ic">${svg(r.icon, 15)}</span>
    <span class="name">${r.name}</span>
    ${r.state === 'fired' ? '<span class="pill">Snooze</span>' : ''}
    <span class="sp"></span>
    <span class="t">${r.state === 'paused' ? 'Paused' : r.mins}</span>
    ${btn(r, 'pbtn xs')}
  </div>`).join('')}</div>`

const nextUp = () => {
  const [hero, ...rest] = [R[1], R[0], R[2], R[3]] // soonest first
  return `
  <div class="hero">
    <div class="hl"><span class="chip">${svg(hero.icon, 15)}</span><span class="faint xs up">Next up</span></div>
    <div class="hm"><div><b class="hname">${hero.name}</b><div class="big">${hero.time}</div></div>
      <span class="hb"><span class="ib">${svg(RotateCcw, 15)}</span>${btn(hero)}</span></div>
    <div class="bar"><div style="width:${hero.p * 100}%"></div></div>
  </div>
  <div class="group" style="margin-top:8px">${rest.map((r) => `
    <div class="row b ${r.state === 'paused' ? 'idle' : ''}">
      <span class="chip">${svg(r.icon, 14)}</span><span class="name">${r.name}</span>
      ${r.state === 'fired' ? '<span class="pill">Snooze</span>' : ''}<span class="sp"></span>
      <span class="t ${r.state === 'paused' ? 'muted' : ''}">${r.state === 'paused' ? 'Paused' : r.time}</span>${btn(r, 'pbtn sm')}
    </div>`).join('')}</div>`
}

const OPTIONS = [
  ['A', 'Current', current, 'Today’s cards. Clear, but each reminder takes ~120px and repeats the same chrome four times.'],
  ['B', 'Compact row', compact, 'One line per reminder in a single grouped list. Thin progress line under each row. Reset moves to hover / right-click.'],
  ['C', 'Two-line row', twoLine, 'Name and countdown on top; progress bar and next time below. Keeps every piece of information at half the height.'],
  ['D', 'Ring row', ringRow, 'A mini ring around the icon, the Glance view’s language in list form. Pause appears on the ring when you hover (row 2 shows it).'],
  ['E', 'Fill row', fillRow, 'The row itself fills as time passes. Minutes only. The most compact, and readable at a glance.'],
  ['F', 'Next up', nextUp, 'The soonest reminder gets the spotlight; the rest are compact rows. Answers “what’s next?” first.']
]

const panels = OPTIONS.map(([k, name, fn, note]) => `
  <div class="opt">
    <div class="cap"><span class="k">${k}</span><b>${name}</b><span class="h" data-for="${k}"></span></div>
    <div class="panel" id="p-${k}">${header}<div class="body">${fn()}</div></div>
    <p class="note">${note}</p>
  </div>`).join('')

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Otium · List view options</title>
<style>
  :root { --bg:#1c1c1e; --surface:#262628; --border:#333336; --text:#f2f2f2; --muted:#98989d; --faint:#6a6a6f;
          --track:#38383b; --accent:#7fb09f; --accent-soft:rgba(127,176,159,.16); --hover:rgba(255,255,255,.07); }
  * { box-sizing:border-box; }
  body { margin:0; padding:44px; width:1280px; background:#111113; color:var(--text);
         font:13px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; -webkit-font-smoothing:antialiased; }
  h1 { margin:0 0 4px; font-size:26px; letter-spacing:-.01em; }
  .lede { margin:0 0 30px; color:var(--muted); font-size:14px; }
  .grid { display:grid; grid-template-columns:repeat(3, 360px); gap:36px 52px; align-items:start; }
  .cap { display:flex; align-items:center; gap:8px; margin-bottom:10px; font-size:15px; }
  .k { display:inline-grid; place-items:center; width:22px; height:22px; border-radius:6px; background:var(--accent-soft); color:var(--accent); font-size:12px; font-weight:700; }
  .h { margin-left:auto; color:var(--muted); font-size:12px; }
  .note { margin:10px 2px 0; color:var(--muted); font-size:12px; line-height:1.45; }
  .panel { width:320px; background:var(--bg); border-radius:12px; border:1px solid #2c2c2e; box-shadow:0 14px 40px rgba(0,0,0,.5); overflow:hidden; }
  .hdr { display:flex; align-items:center; padding:12px 12px 8px 16px; font-size:15px; }
  .acts { margin-left:auto; display:flex; align-items:center; gap:8px; color:var(--muted); }
  .acts i { display:grid; place-items:center; font-style:normal; }
  .seg { display:flex; padding:2px; border-radius:8px; background:var(--hover); margin-right:2px; }
  .seg i { width:26px; height:22px; border-radius:6px; } .seg i.on { background:var(--surface); color:var(--text); }
  .body { padding:0 12px 12px; }
  .sp { flex:1; } .muted { color:var(--muted); } .faint { color:var(--faint); } .sm { font-size:12px; } .xs { font-size:11px; }
  .chip { display:grid; place-items:center; flex:none; width:22px; height:22px; border-radius:6px; background:var(--accent-soft); color:var(--accent); }
  .chip.lg { width:30px; height:30px; border-radius:8px; }
  .idle .chip, .idle .ic { background:var(--hover); color:var(--faint); }
  .pbtn { display:grid; place-items:center; flex:none; width:32px; height:32px; border-radius:8px; background:var(--accent-soft); color:var(--accent); }
  .pbtn.sm { width:26px; height:26px; border-radius:7px; } .pbtn.xs { width:22px; height:22px; border-radius:6px; background:transparent; }
  .ib { display:grid; place-items:center; width:28px; height:28px; color:var(--muted); }
  .link { color:var(--accent); font-weight:500; font-size:12px; }
  .pill { font-size:11px; font-weight:600; color:var(--accent); background:var(--accent-soft); padding:2px 7px; border-radius:10px; }
  .t { font-variant-numeric:tabular-nums; font-size:13px; } .t.lg { font-size:17px; font-weight:300; letter-spacing:-.01em; }
  .bar { height:3px; border-radius:2px; background:var(--track); overflow:hidden; } .bar > div { height:100%; background:var(--accent); }
  .bar.thin { flex:1; height:3px; } .idle .bar > div, .idle .uline > div { background:var(--faint); }
  .name { font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

  /* A: current */
  .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px 12px 10px 14px; margin-bottom:8px; }
  .card:last-child { margin-bottom:0; }
  .ctop { display:flex; align-items:center; gap:6px; } .ctop b { font-size:13px; } .ctop .faint { font-size:12px; }
  .big { font-size:30px; font-weight:300; letter-spacing:-.02em; font-variant-numeric:tabular-nums; margin:2px 0 8px; line-height:1.1; }
  .idle .big { color:var(--muted); }
  .cbot { display:flex; justify-content:space-between; margin-top:8px; }

  /* grouped list shared by B, C, D */
  .group { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .row { position:relative; display:flex; align-items:center; gap:10px; padding:0 10px 0 12px; }
  .group .row + .row { border-top:1px solid var(--border); }
  .row.b { height:44px; }
  .uline { position:absolute; left:44px; right:12px; bottom:5px; height:2px; border-radius:1px; background:var(--track); overflow:hidden; }
  .uline > div { height:100%; background:var(--accent); }
  .row.c { height:58px; } .mid { flex:1; min-width:0; display:flex; flex-direction:column; gap:5px; }
  .l1 { display:flex; align-items:baseline; gap:8px; } .l2 { display:flex; align-items:center; gap:8px; }
  .row.d { height:54px; } .row.d .mid { gap:1px; }
  .rwrap { position:relative; width:34px; height:34px; flex:none; }
  .ric, .rhov { position:absolute; inset:0; display:grid; place-items:center; color:var(--accent); }
  .rhov { opacity:0; } .row.d.hover .ric { opacity:0; } .row.d.hover .rhov { opacity:1; }
  .row.d.hover { background:var(--hover); } .idle .ric { color:var(--faint); }
  /* E: fill rows */
  .stack { display:flex; flex-direction:column; gap:6px; }
  .row.e { height:38px; border-radius:9px; background:var(--surface); border:1px solid var(--border); overflow:hidden; gap:8px; }
  .row.e .fill { position:absolute; left:0; top:0; bottom:0; background:var(--accent-soft); }
  .row.e.idle .fill { background:var(--hover); }
  .row.e > *:not(.fill) { position:relative; } .ic { color:var(--accent); display:grid; place-items:center; }
  .row.e .t { color:var(--muted); font-size:12px; } .row.e .pbtn { color:var(--muted); }
  /* F: next up */
  .hero { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px 12px 12px 14px; }
  .hl { display:flex; align-items:center; gap:8px; margin-bottom:6px; } .up { text-transform:uppercase; letter-spacing:.06em; font-weight:600; }
  .hm { display:flex; align-items:flex-end; justify-content:space-between; } .hname { font-size:13px; }
  .hm .big { margin:0 0 8px; } .hb { display:flex; gap:4px; margin-bottom:10px; }
</style></head><body>
  <h1>Otium · List view options</h1>
  <p class="lede">Same four reminders in every option: running (Water, Eye break), just went off with Snooze offered (Stretch), and paused (Test123). Panel height shown top-right.</p>
  <div class="grid">${panels}</div>
  <script>
    const base = document.getElementById('p-A').offsetHeight
    document.querySelectorAll('.h').forEach((el) => {
      const h = document.getElementById('p-' + el.dataset.for).offsetHeight
      el.textContent = el.dataset.for === 'A' ? h + 'px' : h + 'px · ' + Math.round((1 - h / base) * 100) + '% shorter'
    })
  </script>
</body></html>`

writeFileSync(join(HERE, 'index.html'), html)
console.log('wrote index.html with', OPTIONS.length, 'options')
