// Round 2 of List view layouts: four versions each of B (Compact row),
// D (Ring row), E (Fill row) and F (Next up). Writes round-2.html.
// Run from the project root:  node design/list-concepts/make-round-2.mjs
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Bell, Eye, GlassWater, LayoutGrid, List, Move, Pause, Play, Power, RotateCcw, SlidersHorizontal } from 'lucide-react'

const HERE = dirname(fileURLToPath(import.meta.url))
const svg = (Icon, size = 16, extra = {}) =>
  renderToStaticMarkup(createElement(Icon, { size, strokeWidth: 1.75, 'aria-hidden': true, ...extra }))
const solid = { fill: 'currentColor', strokeWidth: 1 }

const R = [
  { name: 'Water', icon: GlassWater, every: 60, time: '50:28', mins: '51 min', short: '51m', p: 0.84, next: '18:10', state: 'running' },
  { name: 'Eye break', icon: Eye, every: 20, time: '10:28', mins: '11 min', short: '11m', p: 0.52, next: '17:30', state: 'running' },
  { name: 'Stretch', icon: Move, every: 30, time: '29:52', mins: '30 min', short: '30m', p: 0.99, next: '17:50', state: 'fired' },
  { name: 'Test123', icon: Bell, every: 30, time: '20:28', mins: '21 min', short: '21m', p: 0.68, next: '', state: 'paused' }
]
// Soonest first; paused ones last (for the Next up family).
const SORTED = [R[1], R[2], R[0], R[3]]

const paused = (r) => r.state === 'paused'
const fired = (r) => r.state === 'fired'
const idle = (r) => (paused(r) ? 'idle' : '')
const pb = (r, cls = 'pbtn sm') => `<span class="${cls}">${svg(paused(r) ? Play : Pause, 13, solid)}</span>`
const snoozePill = (r) => (fired(r) ? '<span class="pill">Snooze</span>' : '')
const hoverTag = '<span class="tag">hover</span>'

function ring(p, size, stroke, isIdle, inner = '') {
  const rad = (size - stroke) / 2
  const c = 2 * Math.PI * rad
  return `<span class="ringbox" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${rad}" fill="none" stroke="var(--track)" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${rad}" fill="none" stroke="${isIdle ? 'var(--faint)' : 'var(--accent)'}" stroke-width="${stroke}"
        stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - p)).toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
    </svg><span class="ringin ${isIdle ? 'idle' : ''}">${inner}</span></span>`
}

const header = `
  <div class="hdr"><b>Otium</b><span class="acts">
    <span class="seg"><i class="on">${svg(List, 14)}</i><i>${svg(LayoutGrid, 14)}</i></span>
    <i>${svg(SlidersHorizontal, 15)}</i><i>${svg(Power, 15)}</i></span></div>`

// ------------------------------------------------------------- B: compact rows

const B1 = () => `<div class="group">${R.map((r) => `
  <div class="row h44 ${idle(r)}"><span class="chip">${svg(r.icon, 14)}</span><span class="name">${r.name}</span>${snoozePill(r)}
    <span class="sp"></span><span class="t ${paused(r) ? 'muted' : ''}">${paused(r) ? 'Paused' : r.time}</span>${pb(r)}
    <div class="uline"><div style="width:${r.p * 100}%"></div></div></div>`).join('')}</div>`

const B2 = () => `<div class="group">${R.map((r, i) => `
  <div class="row h40 ${idle(r)} ${i === 1 ? 'hover' : ''}"><span class="ic">${svg(r.icon, 15)}</span><span class="name">${r.name}</span>${snoozePill(r)}
    ${i === 1 ? hoverTag : ''}<span class="sp"></span>
    ${i === 1 ? pb(r, 'pbtn xs solidbg') : `<span class="t ${paused(r) ? 'muted' : ''}">${paused(r) ? 'Paused' : r.time}</span>`}
    <div class="uline full"><div style="width:${r.p * 100}%"></div></div></div>`).join('')}</div>`

const B3 = () => `<div class="group">${R.map((r) => `
  <div class="row h44 ${idle(r)}"><span class="chip">${svg(r.icon, 14)}</span><span class="name">${r.name}</span>
    <span class="sp"></span>${fired(r) ? snoozePill(r) : `<span class="minibar"><span style="width:${r.p * 100}%"></span></span>`}
    <span class="t w42 ${paused(r) ? 'muted' : ''}">${r.time}</span>${pb(r)}</div>`).join('')}</div>`

const B4 = () => `<div class="group">${R.map((r, i) => {
  const open = i === 1
  return `
  <div class="row ${open ? 'h58 hover' : 'h44'} ${idle(r)}"><span class="chip">${svg(r.icon, 14)}</span>
    <div class="mid"><span class="name">${r.name} ${open ? hoverTag : ''}</span>${open ? `<span class="faint xs">${r.every} min · next ${r.next}</span>` : ''}</div>
    ${snoozePill(r)}<span class="t ${paused(r) ? 'muted' : ''}">${paused(r) ? 'Paused' : r.time}</span>${open ? `<span class="pbtn xs" title="Reset">${svg(RotateCcw, 14)}</span>` : ''}${pb(r)}
    <div class="uline"><div style="width:${r.p * 100}%"></div></div></div>`
}).join('')}</div>`

// --------------------------------------------------------------- D: ring rows

const D1 = () => `<div class="group">${R.map((r) => `
  <div class="row h54 ${idle(r)}">${ring(r.p, 34, 3, paused(r), svg(r.icon, 15))}
    <div class="mid"><span class="name">${r.name}</span>${fired(r) ? '<span class="link xs">Snooze 5 min</span>' : `<span class="faint xs">${paused(r) ? 'Paused' : `every ${r.every} min · next ${r.next}`}</span>`}</div>
    <span class="t lg ${paused(r) ? 'muted' : ''}">${r.time}</span></div>`).join('')}</div>`

const D2 = () => `<div class="group">${R.map((r) => `
  <div class="row h54 ${idle(r)}"><span class="chip lg">${svg(r.icon, 16)}</span>
    <div class="mid"><span class="name">${r.name}</span>${fired(r) ? '<span class="link xs">Snooze 5 min</span>' : `<span class="faint xs">${paused(r) ? 'Paused' : `next ${r.next}`}</span>`}</div>
    ${ring(r.p, 40, 3, paused(r), `<span class="rt">${r.short}</span>`)}</div>`).join('')}</div>`

const D3 = () => `<div class="group">${R.map((r) => `
  <div class="row h44 ${idle(r)}">${ring(r.p, 28, 2.5, paused(r), svg(r.icon, 13))}
    <span class="name">${r.name}</span>${snoozePill(r)}<span class="sp"></span>
    <span class="t ${paused(r) ? 'muted' : ''}">${paused(r) ? 'Paused' : r.time}</span></div>`).join('')}</div>`

const D4 = () => `<div class="group">${R.map((r) => `
  <div class="row h56 ${idle(r)}">${ring(r.p, 36, 3, paused(r), svg(r.icon, 15))}
    <div class="mid"><span class="name">${r.name}</span>${fired(r) ? '<span class="link xs">Snooze 5 min</span>' : `<span class="faint xs">${paused(r) ? 'Paused' : `next ${r.next}`}</span>`}</div>
    <span class="t xl ${paused(r) ? 'muted' : ''}">${r.time}</span>${pb(r)}</div>`).join('')}</div>`

// --------------------------------------------------------------- E: fill rows

const fillRow = (r, inner, cls = '') => `
  <div class="row fillrow ${cls} ${idle(r)}"><div class="fill" style="width:${r.p * 100}%"></div>${inner}</div>`

const E1 = () => `<div class="stack">${R.map((r) => fillRow(r, `
  <span class="ic">${svg(r.icon, 15)}</span><span class="name">${r.name}</span>${snoozePill(r)}<span class="sp"></span>
  <span class="t muted sm">${paused(r) ? 'Paused' : r.mins}</span>${pb(r, 'pbtn xs')}`, 'pillrow')).join('')}</div>`

const E2 = () => `<div class="group">${R.map((r) => fillRow(r, `
  <span class="ic">${svg(r.icon, 15)}</span><span class="name">${r.name}</span>${snoozePill(r)}<span class="sp"></span>
  <span class="t muted sm">${paused(r) ? 'Paused' : r.mins}</span>`, 'h40')).join('')}</div>`

const E3 = () => `<div class="stack">${R.map((r) => fillRow(r, `
  <span class="ic">${svg(r.icon, 15)}</span><span class="name">${r.name}</span>${snoozePill(r)}<span class="sp"></span>
  <span class="t ${paused(r) ? 'muted' : ''}">${r.time}</span>${pb(r, 'pbtn sm')}`, 'pillrow tall')).join('')}</div>`

const E4 = () => `<div class="tiles">${R.map((r) => `
  <div class="tile ${idle(r)}"><div class="fill" style="width:${r.p * 100}%"></div>
    <div class="tt"><span class="ic">${svg(r.icon, 15)}</span>${fired(r) ? '<span class="pill">Snooze</span>' : `<span class="pbtn xs">${svg(paused(r) ? Play : Pause, 12, solid)}</span>`}</div>
    <span class="name">${r.name}</span><span class="t muted sm">${paused(r) ? 'Paused' : r.mins}</span></div>`).join('')}</div>`

// --------------------------------------------------------------- F: next up

const restRows = (rows) => `<div class="group" style="margin-top:8px">${rows.map((r) => `
  <div class="row h40 ${idle(r)}"><span class="chip">${svg(r.icon, 14)}</span><span class="name">${r.name}</span>${snoozePill(r)}
    <span class="sp"></span><span class="t ${paused(r) ? 'muted' : ''}">${paused(r) ? 'Paused' : r.time}</span>${pb(r)}</div>`).join('')}</div>`

const F1 = () => {
  const [h, ...rest] = SORTED
  return `<div class="hero"><div class="hl"><span class="chip">${svg(h.icon, 15)}</span><span class="faint xs up">Next up</span></div>
    <div class="hm"><div><b>${h.name}</b><div class="big">${h.time}</div></div><span class="hb">${pb(h, 'pbtn')}</span></div>
    <div class="bar"><div style="width:${h.p * 100}%"></div></div></div>${restRows(rest)}`
}

const F2 = () => {
  const [h, ...rest] = SORTED
  return `<div class="hero row h64 herorow">${ring(h.p, 44, 3.5, false, svg(h.icon, 18))}
    <div class="mid"><span class="faint xs up">Next up</span><b>${h.name}</b></div>
    <span class="t xxl">${h.time}</span>${pb(h)}</div>${restRows(rest)}`
}

const F3 = () => `<div class="group">${SORTED.map((r, i) => `
  <div class="row h44 ${idle(r)} ${i === 0 ? 'first' : ''}"><span class="chip">${svg(r.icon, 14)}</span>
    <span class="name">${r.name}</span>${i === 0 ? '<span class="pill solid">Next</span>' : snoozePill(r)}<span class="sp"></span>
    <span class="t ${i === 0 ? 'lg' : ''} ${paused(r) ? 'muted' : ''}">${paused(r) ? 'Paused' : r.time}</span>${pb(r)}
    <div class="uline"><div style="width:${r.p * 100}%"></div></div></div>`).join('')}</div>`

const F4 = () => {
  const [h, ...rest] = SORTED
  return `<div class="hero bigring">${ring(h.p, 76, 5, false, svg(h.icon, 26))}
    <div class="mid"><span class="faint xs up">Next up</span><b class="hn">${h.name}</b><span class="t xxl">${h.time}</span></div>${pb(h, 'pbtn')}</div>
    <div class="strip">${rest.map((r) => `
      <div class="mini ${idle(r)}">${ring(r.p, 40, 3, paused(r), svg(r.icon, 15))}<span class="mn">${r.name}</span>
        <span class="${fired(r) ? 'link' : 'muted'} xs">${fired(r) ? 'Snooze' : paused(r) ? 'Paused' : r.mins}</span></div>`).join('')}</div>`
}

const FAMILIES = [
  ['B', 'Compact row', [
    ['B1', 'Original', B1, 'One line, icon chip, progress line under the name, pause always visible.'],
    ['B2', 'Quiet', B2, 'Plain icons, full-width progress line. Pause replaces the time on hover (row 2).'],
    ['B3', 'Inline bar', B3, 'A small progress bar sits beside the time; no lines under rows.'],
    ['B4', 'Expand on hover', B4, 'Rows stay one line; hovering reveals interval, next time and Reset (row 2).']
  ]],
  ['D', 'Ring row', [
    ['D1', 'Original', D1, 'Mini ring around the icon, details line, time on the right.'],
    ['D2', 'Time in ring', D2, 'Icon on the left, the ring on the right with minutes inside it.'],
    ['D3', 'Single line', D3, 'Smaller ring, one line per reminder. The most compact ring version.'],
    ['D4', 'Big time', D4, 'Larger countdown and an always-visible pause button.']
  ]],
  ['E', 'Fill row', [
    ['E1', 'Original', E1, 'Separate rounded rows that fill as time passes. Minutes only.'],
    ['E2', 'Grouped', E2, 'One list with dividers; the fill is a quiet background. No buttons.'],
    ['E3', 'Exact time', E3, 'Fill rows with the exact countdown and a pause button.'],
    ['E4', 'Tiles', E4, 'Two-column fill tiles, like small widgets.']
  ]],
  ['F', 'Next up', [
    ['F1', 'Original', F1, 'Large card for the soonest reminder, compact rows for the rest.'],
    ['F2', 'Slim spotlight', F2, 'The spotlight shrinks to one tall row with a ring.'],
    ['F3', 'Sorted list', F3, 'No separate card: the list is sorted by time and the first row is highlighted.'],
    ['F4', 'Ring + strip', F4, 'A big ring for what’s next; the others as a strip of mini rings.']
  ]]
]

const families = FAMILIES.map(([k, title, opts]) => `
  <section><h2><span class="k">${k}</span>${title}</h2><div class="row4">${opts.map(([id, name, fn, note]) => `
    <div class="opt"><div class="cap"><b>${id}</b><span>${name}</span><span class="h" data-for="${id}"></span></div>
      <div class="panel" id="p-${id}">${header}<div class="body">${fn()}</div></div><p class="note">${note}</p></div>`).join('')}
  </div></section>`).join('')

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Otium · List view, round 2</title>
<style>
  :root { --bg:#1c1c1e; --surface:#262628; --border:#333336; --text:#f2f2f2; --muted:#98989d; --faint:#6a6a6f;
          --track:#38383b; --accent:#7fb09f; --accent-soft:rgba(127,176,159,.16); --hover:rgba(255,255,255,.07); }
  * { box-sizing:border-box; }
  body { margin:0; padding:44px; width:1520px; background:#111113; color:var(--text);
         font:13px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; -webkit-font-smoothing:antialiased; }
  h1 { margin:0 0 4px; font-size:26px; letter-spacing:-.01em; } .lede { margin:0 0 26px; color:var(--muted); font-size:14px; }
  section { margin-bottom:34px; }
  h2 { display:flex; align-items:center; gap:10px; margin:0 0 14px; font-size:18px; }
  .k { display:inline-grid; place-items:center; width:26px; height:26px; border-radius:7px; background:var(--accent-soft); color:var(--accent); font-size:13px; }
  .row4 { display:grid; grid-template-columns:repeat(4, 320px); gap:28px; align-items:start; }
  .cap { display:flex; align-items:baseline; gap:8px; margin-bottom:8px; font-size:14px; } .cap span:not(.h) { color:var(--text); }
  .h { margin-left:auto; color:var(--muted); font-size:12px; }
  .note { margin:9px 2px 0; color:var(--muted); font-size:12px; line-height:1.45; }
  .panel { width:320px; background:var(--bg); border-radius:12px; border:1px solid #2c2c2e; box-shadow:0 14px 40px rgba(0,0,0,.5); overflow:hidden; }
  .hdr { display:flex; align-items:center; padding:12px 12px 8px 16px; font-size:15px; }
  .acts { margin-left:auto; display:flex; align-items:center; gap:8px; color:var(--muted); } .acts i { display:grid; place-items:center; font-style:normal; }
  .seg { display:flex; padding:2px; border-radius:8px; background:var(--hover); margin-right:2px; }
  .seg i { width:26px; height:22px; border-radius:6px; } .seg i.on { background:var(--surface); color:var(--text); }
  .body { padding:0 12px 12px; }
  .sp { flex:1; } .muted { color:var(--muted); } .faint { color:var(--faint); } .sm { font-size:12px; } .xs { font-size:11px; }
  .up { text-transform:uppercase; letter-spacing:.06em; font-weight:600; font-size:10px; }
  .name { font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .chip { display:grid; place-items:center; flex:none; width:22px; height:22px; border-radius:6px; background:var(--accent-soft); color:var(--accent); }
  .chip.lg { width:30px; height:30px; border-radius:8px; }
  .ic { display:grid; place-items:center; flex:none; color:var(--accent); }
  .idle .chip, .idle .ic { color:var(--faint); } .idle .chip { background:var(--hover); }
  .pbtn { display:grid; place-items:center; flex:none; width:32px; height:32px; border-radius:8px; background:var(--accent-soft); color:var(--accent); }
  .pbtn.sm { width:26px; height:26px; border-radius:7px; } .pbtn.xs { width:22px; height:22px; border-radius:6px; background:transparent; color:var(--muted); }
  .pbtn.solidbg { background:var(--accent-soft); color:var(--accent); }
  .pill { font-size:10.5px; font-weight:600; color:var(--accent); background:var(--accent-soft); padding:2px 7px; border-radius:10px; flex:none; }
  .pill.solid { background:var(--accent); color:#13201c; }
  .tag { font-size:9.5px; color:#d9b36a; border:1px dashed #d9b36a88; border-radius:4px; padding:0 4px; font-weight:500; }
  .link { color:var(--accent); font-weight:500; }
  .t { font-variant-numeric:tabular-nums; font-size:13px; flex:none; } .t.lg { font-size:16px; font-weight:400; }
  .t.xl { font-size:20px; font-weight:300; } .t.xxl { font-size:24px; font-weight:300; letter-spacing:-.01em; } .w42 { width:40px; text-align:right; }
  .bar { height:3px; border-radius:2px; background:var(--track); overflow:hidden; } .bar > div { height:100%; background:var(--accent); }

  .group { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .row { position:relative; display:flex; align-items:center; gap:10px; padding:0 10px 0 12px; }
  .group .row + .row { border-top:1px solid var(--border); }
  .h40 { height:40px; } .h44 { height:44px; } .h54 { height:54px; } .h56 { height:56px; } .h58 { height:58px; } .h64 { height:64px; }
  .row.hover { background:var(--hover); }
  .mid { flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
  .uline { position:absolute; left:44px; right:12px; bottom:5px; height:2px; border-radius:1px; background:var(--track); overflow:hidden; }
  .uline.full { left:12px; } .uline > div { height:100%; background:var(--accent); } .idle .uline > div { background:var(--faint); }
  .minibar { width:46px; height:4px; border-radius:2px; background:var(--track); overflow:hidden; flex:none; }
  .minibar span { display:block; height:100%; background:var(--accent); } .idle .minibar span { background:var(--faint); }

  .ringbox { position:relative; display:inline-block; flex:none; }
  .ringbox svg { display:block; }
  .ringin { position:absolute; inset:0; display:grid; place-items:center; color:var(--accent); }
  .ringin.idle { color:var(--faint); } .rt { font-size:10.5px; font-weight:600; color:var(--text); font-variant-numeric:tabular-nums; }
  .idle .rt { color:var(--muted); }

  .stack { display:flex; flex-direction:column; gap:6px; }
  .fillrow { overflow:hidden; gap:8px; } .fillrow > *:not(.fill) { position:relative; }
  .fill { position:absolute; left:0; top:0; bottom:0; background:var(--accent-soft); } .idle .fill { background:var(--hover); }
  .pillrow { height:38px; border-radius:9px; background:var(--surface); border:1px solid var(--border); } .pillrow.tall { height:44px; }
  .tiles { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .tile { position:relative; overflow:hidden; display:flex; flex-direction:column; gap:2px; padding:10px 10px 9px 12px; border-radius:11px; background:var(--surface); border:1px solid var(--border); }
  .tile > *:not(.fill) { position:relative; } .tt { display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; height:22px; }

  .hero { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:12px 12px 12px 14px; }
  .hl { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
  .hm { display:flex; align-items:flex-end; justify-content:space-between; } .hb { margin-bottom:10px; }
  .big { font-size:30px; font-weight:300; letter-spacing:-.02em; font-variant-numeric:tabular-nums; margin:0 0 8px; line-height:1.1; }
  .herorow { padding:0 10px 0 12px; } .herorow .mid { gap:0; }
  .row.first { background:var(--accent-soft); }
  .bigring { display:flex; align-items:center; gap:14px; } .bigring .mid { gap:0; } .hn { font-size:14px; }
  .strip { display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:8px; }
  .mini { display:flex; flex-direction:column; align-items:center; gap:3px; padding:10px 4px 8px; border-radius:11px; background:var(--surface); border:1px solid var(--border); }
  .mn { font-weight:600; font-size:12px; margin-top:3px; }
</style></head><body>
  <h1>Otium · List view, round 2</h1>
  <p class="lede">Four versions each of B, D, E and F. Same four reminders: running (Water, Eye break), just went off (Stretch), paused (Test123).
    Rows marked <span class="tag">hover</span> show the hover state. Panel height top-right (round 1's current design: 591px).</p>
  ${families}
  <script>
    document.querySelectorAll('.h').forEach((el) => {
      const h = document.getElementById('p-' + el.dataset.for).offsetHeight
      el.textContent = h + 'px · ' + Math.round((1 - h / 591) * 100) + '% shorter'
    })
  </script>
</body></html>`

writeFileSync(join(HERE, 'round-2.html'), html)
console.log('wrote round-2.html with', FAMILIES.reduce((n, f) => n + f[2].length, 0), 'layouts')
