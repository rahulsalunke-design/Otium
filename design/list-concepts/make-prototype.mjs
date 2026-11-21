// Interactive prototype of List view options B4 (Expand on hover) and D4 (Big time).
// Writes prototype.html next to this script; open it in a browser to try it.
// Run from the project root:  node design/list-concepts/make-prototype.mjs
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
const solid = { fill: 'currentColor', strokeWidth: 1 }

const ICONS = {
  water: svg(GlassWater, 14), eye: svg(Eye, 14), move: svg(Move, 14), bell: svg(Bell, 14),
  waterL: svg(GlassWater, 15), eyeL: svg(Eye, 15), moveL: svg(Move, 15), bellL: svg(Bell, 15),
  pause: svg(Pause, 13, solid), play: svg(Play, 13, solid), reset: svg(RotateCcw, 14), resetL: svg(RotateCcw, 15)
}

const header = `
  <div class="hdr"><b>Otium</b><span class="acts">
    <span class="seg"><i class="on">${svg(List, 14)}</i><i>${svg(LayoutGrid, 14)}</i></span>
    <i>${svg(SlidersHorizontal, 15)}</i><i>${svg(Power, 15)}</i></span></div>`

const html = `<!doctype html>
<html lang="en" data-theme="dark"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Otium · List prototype (B4, D4, Hybrid)</title>
<style>
  :root[data-theme="dark"] { --page:#111113; --bg:#1c1c1e; --surface:#262628; --border:#333336; --text:#f2f2f2; --muted:#98989d;
    --faint:#6a6a6f; --track:#38383b; --accent:#7fb09f; --accent-soft:rgba(127,176,159,.16); --hover:rgba(255,255,255,.06);
    --glow:rgba(127,176,159,.32); --panel-edge:#2c2c2e; --shadow:0 18px 50px rgba(0,0,0,.55); }
  :root[data-theme="light"] { --page:#E9E9E6; --bg:#f7f7f5; --surface:#ffffff; --border:#e7e7e3; --text:#1d1d1f; --muted:#6e6e73;
    --faint:#a1a1a6; --track:#ecece8; --accent:#4f7f6f; --accent-soft:rgba(79,127,111,.12); --hover:rgba(0,0,0,.04);
    --glow:rgba(79,127,111,.28); --panel-edge:#dcdcd8; --shadow:0 18px 50px rgba(0,0,0,.14); }
  * { box-sizing:border-box; }
  body { margin:0; min-height:100vh; padding:28px 32px 48px; background:var(--page); color:var(--text);
         font:13px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; -webkit-font-smoothing:antialiased; }
  button { font:inherit; color:inherit; border:0; background:none; padding:0; cursor:pointer; }
  button:focus-visible, .row:focus-visible { outline:2px solid var(--accent); outline-offset:-2px; }
  h1 { margin:0 0 4px; font-size:22px; letter-spacing:-.01em; }
  .lede { margin:0 0 18px; color:var(--muted); max-width:820px; }

  .controls { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:26px; }
  .ctl { display:flex; align-items:center; gap:2px; padding:3px; border-radius:9px; background:var(--surface); border:1px solid var(--border); }
  .ctl span { padding:0 8px 0 6px; color:var(--muted); font-size:12px; }
  .ctl button { padding:5px 10px; border-radius:6px; font-size:12px; color:var(--muted); }
  .ctl button.on { background:var(--accent-soft); color:var(--accent); font-weight:600; }
  .ctl button:hover:not(.on) { color:var(--text); }
  .action { padding:7px 12px; border-radius:9px; background:var(--accent); color:#fff; font-size:12px; font-weight:600; }
  :root[data-theme="dark"] .action { color:#13201c; }
  :root .action.ghost { background:var(--surface); color:var(--text); border:1px solid var(--border); font-weight:500; }

  .stage { display:flex; flex-wrap:wrap; gap:48px; align-items:flex-start; }
  .proto h2 { margin:0 0 10px; font-size:15px; display:flex; align-items:center; gap:8px; }
  .k { display:inline-grid; place-items:center; height:22px; padding:0 7px; border-radius:6px; background:var(--accent-soft); color:var(--accent); font-size:12px; }
  .panel { width:320px; max-width:100%; background:var(--bg); border-radius:12px; border:1px solid var(--panel-edge); box-shadow:var(--shadow); overflow:hidden; }
  .hdr { display:flex; align-items:center; padding:12px 12px 8px 16px; font-size:15px; }
  .acts { margin-left:auto; display:flex; align-items:center; gap:8px; color:var(--muted); } .acts i { display:grid; place-items:center; font-style:normal; }
  .seg { display:flex; padding:2px; border-radius:8px; background:var(--hover); margin-right:2px; }
  .seg i { width:26px; height:22px; border-radius:6px; display:grid; place-items:center; } .seg i.on { background:var(--surface); color:var(--text); }
  .body { padding:0 12px 12px; }
  .how { margin:12px 2px 0; padding:0; list-style:none; color:var(--muted); font-size:12px; max-width:320px; }
  .how li { margin:3px 0; padding-left:14px; position:relative; } .how li::before { content:'·'; position:absolute; left:3px; color:var(--accent); font-weight:700; }

  .group { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .row { position:relative; display:flex; align-items:center; gap:10px; padding:0 10px 0 12px; transition:background-color .15s ease; }
  .row + .row { border-top:1px solid var(--border); }
  .row:hover, .row:focus-within { background:var(--hover); }
  .name { font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .mid { flex:1; min-width:0; display:flex; flex-direction:column; }
  .sub { font-size:11px; color:var(--faint); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .t { font-variant-numeric:tabular-nums; flex:none; }
  .chip { display:grid; place-items:center; flex:none; width:22px; height:22px; border-radius:6px; background:var(--accent-soft); color:var(--accent); transition:all .2s; }
  .pbtn { display:grid; place-items:center; flex:none; width:26px; height:26px; border-radius:7px; background:var(--accent-soft); color:var(--accent); transition:background-color .15s, color .15s; }
  .pbtn:hover { background:var(--accent); color:var(--bg); }
  .ib { display:grid; place-items:center; flex:none; height:26px; border-radius:7px; color:var(--muted); }
  .ib:hover { color:var(--text); background:var(--hover); }
  .pill { flex:none; font-size:10.5px; font-weight:600; color:var(--accent); background:var(--accent-soft); padding:3px 8px; border-radius:10px; transition:background-color .15s, color .15s; }
  .pill:hover { background:var(--accent); color:var(--bg); }
  .link { color:var(--accent); font-weight:500; font-size:11px; } .link:hover { text-decoration:underline; }
  .is-paused .name { color:var(--muted); } .is-paused .chip { background:var(--hover); color:var(--faint); }
  .is-paused .t { color:var(--muted); }
  @keyframes glow { 0% { box-shadow: inset 0 0 0 999px var(--glow); } 100% { box-shadow: inset 0 0 0 999px transparent; } }
  .just-fired { animation: glow 2.2s ease-out; }
  @keyframes pop { 0% { transform:scale(.6); opacity:0 } 70% { transform:scale(1.08) } 100% { transform:scale(1); opacity:1 } }
  .pill.enter { animation: pop .35s ease-out; }

  /* ---------- B4: expand on hover */
  .b4 .row { height:44px; transition: height .18s ease, background-color .15s ease; }
  .b4 .row:hover, .b4 .row:focus-within { height:58px; }
  .b4 .sub { max-height:0; opacity:0; transition: max-height .18s ease, opacity .18s ease; }
  .b4 .row:hover .sub, .b4 .row:focus-within .sub { max-height:16px; opacity:1; }
  .b4 .reset { width:0; opacity:0; overflow:hidden; transition: width .18s ease, opacity .18s ease; }
  .b4 .row:hover .reset, .b4 .row:focus-within .reset { width:26px; opacity:1; }
  .b4 .t { font-size:13px; }
  .uline { position:absolute; left:44px; right:12px; bottom:5px; height:2px; border-radius:1px; background:var(--track); overflow:hidden; }
  .uline > div { height:100%; background:var(--accent); width:0; transition: width .3s linear; }
  .is-paused .uline > div { background:var(--faint); }

  /* ---------- D4: big time */
  .d4 .row { height:56px; }
  .d4 .t { font-size:20px; font-weight:300; letter-spacing:-.01em; }
  .ringbtn { position:relative; width:36px; height:36px; flex:none; border-radius:50%; }
  .ringbtn svg.ring { position:absolute; inset:0; }
  .ringbtn .track { fill:none; stroke:var(--track); stroke-width:3; }
  .ringbtn .arc { fill:none; stroke:var(--accent); stroke-width:3; stroke-linecap:round; transition: stroke-dashoffset .3s linear, stroke .2s; }
  .is-paused .ringbtn .arc { stroke:var(--faint); }
  .ringbtn .ri, .ringbtn .rr { position:absolute; inset:0; display:grid; place-items:center; color:var(--accent); transition: opacity .15s ease, transform .2s ease; }
  .is-paused .ringbtn .ri { color:var(--faint); }
  .ringbtn .rr { opacity:0; transform:rotate(-60deg); }
  .ringbtn:hover .ri, .ringbtn:focus-visible .ri { opacity:0; }
  .ringbtn:hover .rr, .ringbtn:focus-visible .rr { opacity:1; transform:rotate(0); }
  .ringbtn:hover { background:var(--accent-soft); }
  .d4 .mid { gap:1px; }

  /* ---------- Hybrid: D4's ring, B4's compact row that expands on hover */
  .hy .row { height:46px; transition: height .18s ease, background-color .15s ease; }
  .hy .row:hover, .hy .row:focus-within { height:60px; }
  .hy .ringbtn { width:30px; height:30px; }
  .hy .t { font-size:17px; font-weight:300; letter-spacing:-.01em; }
  .hy .sub { max-height:0; opacity:0; transition: max-height .18s ease, opacity .18s ease; }
  .hy .row:hover .sub, .hy .row:focus-within .sub { max-height:16px; opacity:1; }
  .hy .snooze { display:none; }
  .hy .row.offered .snooze, .hy .row:hover .snooze, .hy .row:focus-within .snooze { display:inline-block; animation: pop .3s ease-out; }

  @media (max-width: 600px) { body { padding:18px 14px 40px; } .stage { gap:32px; } h1 { font-size:19px; } }
  .toast { position:fixed; left:50%; bottom:26px; transform:translateX(-50%) translateY(20px); opacity:0; padding:10px 16px; border-radius:10px;
           background:var(--surface); border:1px solid var(--border); box-shadow:var(--shadow); font-size:12.5px; transition: all .25s ease; pointer-events:none; }
  .toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
  .toast b { color:var(--accent); }
</style></head>
<body>
  <h1>Otium · List view prototype</h1>
  <p class="lede">B4, D4 and a Hybrid of the two share the same live timers, like the real app would. Hover rows, pause, reset and snooze; speed time up to watch rings and bars move, or make a reminder go off.</p>

  <div class="controls">
    <div class="ctl" id="speed"><span>Speed</span><button data-v="1" class="on">1×</button><button data-v="10">10×</button><button data-v="60">60×</button></div>
    <button class="action" id="fire">Make Water go off now</button>
    <button class="action ghost" id="restart">Reset demo</button>
    <div class="ctl" id="theme"><span>Theme</span><button data-v="dark" class="on">Dark</button><button data-v="light">Light</button></div>
  </div>

  <div class="stage">
    <div class="proto">
      <h2><span class="k">B4</span>Expand on hover</h2>
      <div class="panel">${header}<div class="body"><div class="group b4" id="b4"></div></div></div>
      <ul class="how">
        <li>Hover (or Tab to) a row: it expands to show the interval, next time and Reset.</li>
        <li>Pause / Play is always one click away.</li>
        <li>When a reminder goes off the row glows and a Snooze pill appears.</li>
      </ul>
    </div>
    <div class="proto">
      <h2><span class="k">D4</span>Big time</h2>
      <div class="panel">${header}<div class="body"><div class="group d4" id="d4"></div></div></div>
      <ul class="how">
        <li>The ring empties as time passes. Hover the ring: the icon turns into Reset; click to restart.</li>
        <li>The large countdown and Pause / Play stay visible on every row.</li>
        <li>When a reminder goes off: the row glows and "Snooze 5 min" replaces the next time.</li>
      </ul>
    </div>
    <div class="proto">
      <h2><span class="k">H</span>Hybrid · B4 × D4</h2>
      <div class="panel">${header}<div class="body"><div class="group hy" id="hy"></div></div></div>
      <ul class="how">
        <li>Compact by default: a small ring gauge, name, countdown and Pause / Play.</li>
        <li>Hover (or Tab to) a row: it expands to show how often it repeats (e.g. "every 60 min"), plus a Snooze button.</li>
        <li>Hover the ring: it turns into Reset; click to restart.</li>
        <li>When a reminder goes off the row glows and Snooze stays visible without hovering.</li>
      </ul>
    </div>
  </div>
  <div class="toast" id="toast"></div>

<script>
const ICONS = ${JSON.stringify(ICONS)}
const MIN = 60000, SNOOZE = 5 * MIN, OFFER = 10 * MIN
const START = [
  { id:'water', name:'Water', icon:'water', every:60, left:50*MIN + 28000 },
  { id:'eyes', name:'Eye break', icon:'eye', every:20, left:10*MIN + 28000 },
  { id:'stretch', name:'Stretch', icon:'move', every:30, left:30*MIN - 8000, fired:true },
  { id:'test', name:'Test123', icon:'bell', every:30, left:20*MIN + 28000, paused:true }
]
let state, sim, speed = 1, last = performance.now()
const realStart = Date.now()

function restart() {
  sim = 0
  state = START.map((r) => ({ ...r, cycle: r.every * MIN, paused: !!r.paused, snoozed: false,
    firedAt: r.fired ? -8000 : null, pulse: 0 }))
  build()
}

const fmt = (ms) => { const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }
const clock = (ms) => new Date(realStart + ms).toLocaleTimeString([], { hour:'numeric', minute:'2-digit' })
const offered = (r) => r.firedAt !== null && sim - r.firedAt < OFFER

function toast(msg) {
  const t = document.getElementById('toast'); t.innerHTML = msg; t.classList.add('show')
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2200)
}

// ---- actions
function act(id, what) {
  const r = state.find((x) => x.id === id)
  if (what === 'toggle') { r.paused = !r.paused; toast(r.paused ? '<b>' + r.name + '</b> paused' : '<b>' + r.name + '</b> running') }
  if (what === 'reset') { r.left = r.every * MIN; r.cycle = r.left; r.snoozed = false; r.firedAt = null; toast('<b>' + r.name + '</b> restarted · ' + r.every + ' min') }
  if (what === 'snooze') { r.left = SNOOZE; r.cycle = SNOOZE; r.snoozed = true; r.firedAt = null; r.paused = false; toast('<b>' + r.name + '</b> snoozed for 5 min') }
  update()
}

function fire(r) {
  r.left = r.every * MIN; r.cycle = r.left; r.snoozed = false; r.firedAt = sim; r.pulse++
  toast('🔔 <b>' + r.name + '</b> · time for a break')
}

// ---- build rows once; update() only changes text and attributes (keeps hover smooth)
function build() {
  const b4 = document.getElementById('b4'), d4 = document.getElementById('d4')
  b4.innerHTML = state.map((r) => \`
    <div class="row" data-id="\${r.id}" tabindex="0">
      <span class="chip">\${ICONS[r.icon]}</span>
      <div class="mid"><span class="name">\${r.name}</span><span class="sub"></span></div>
      <button class="pill snooze" data-act="snooze" title="Remind me again in 5 minutes">Snooze</button>
      <span class="t"></span>
      <button class="ib reset" data-act="reset" title="Reset" aria-label="Reset \${r.name}">\${ICONS.reset}</button>
      <button class="pbtn" data-act="toggle"></button>
      <div class="uline"><div></div></div>
    </div>\`).join('')
  const C = 2 * Math.PI * 16.5
  d4.innerHTML = state.map((r) => \`
    <div class="row" data-id="\${r.id}">
      <button class="ringbtn" data-act="reset" title="Reset" aria-label="Reset \${r.name}">
        <svg class="ring" viewBox="0 0 36 36"><circle class="track" cx="18" cy="18" r="16.5"/>
          <circle class="arc" cx="18" cy="18" r="16.5" stroke-dasharray="\${C}" transform="rotate(-90 18 18)"/></svg>
        <span class="ri">\${ICONS[r.icon + 'L']}</span><span class="rr">\${ICONS.resetL}</span>
      </button>
      <div class="mid"><span class="name">\${r.name}</span><span class="sub"></span></div>
      <span class="t"></span>
      <button class="pbtn" data-act="toggle"></button>
    </div>\`).join('')
  const hy = document.getElementById('hy'), CS = 2 * Math.PI * 13.5
  hy.innerHTML = state.map((r) => \`
    <div class="row" data-id="\${r.id}" tabindex="0">
      <button class="ringbtn" data-act="reset" title="Reset" aria-label="Reset \${r.name}">
        <svg class="ring" viewBox="0 0 30 30"><circle class="track" cx="15" cy="15" r="13.5"/>
          <circle class="arc" cx="15" cy="15" r="13.5" stroke-dasharray="\${CS}" data-c="\${CS}" transform="rotate(-90 15 15)"/></svg>
        <span class="ri">\${ICONS[r.icon]}</span><span class="rr">\${ICONS.reset}</span>
      </button>
      <div class="mid"><span class="name">\${r.name}</span><span class="sub"></span></div>
      <button class="pill snooze" data-act="snooze" title="Remind me again in 5 minutes">Snooze</button>
      <span class="t"></span>
      <button class="pbtn" data-act="toggle"></button>
    </div>\`).join('')
  for (const el of document.querySelectorAll('[data-act]')) {
    el.addEventListener('click', (e) => { e.stopPropagation(); act(el.closest('.row').dataset.id, el.dataset.act) })
  }
  update()
}

function update() {
  const C = 2 * Math.PI * 16.5
  for (const r of state) {
    const p = Math.max(0, Math.min(1, r.left / r.cycle))
    const next = r.paused ? '' : clock(sim + r.left)
    const pulse = String(r.pulse)
    for (const row of document.querySelectorAll('.row[data-id="' + r.id + '"]')) {
      row.classList.toggle('is-paused', r.paused)
      if (row.dataset.pulse !== pulse) {
        if (row.dataset.pulse !== undefined) { row.classList.remove('just-fired'); void row.offsetWidth; row.classList.add('just-fired') }
        row.dataset.pulse = pulse
      }
      const view = row.parentElement.id, isB4 = view === 'b4'
      const t = row.querySelector('.t'), sub = row.querySelector('.sub'), btn = row.querySelector('.pbtn')
      const mode = r.paused ? 'play' : 'pause'
      if (btn.dataset.mode !== mode) { btn.dataset.mode = mode; btn.innerHTML = ICONS[mode]; btn.title = r.paused ? 'Start' : 'Pause' }
      if (isB4) {
        t.textContent = r.paused ? 'Paused' : fmt(r.left)
        sub.textContent = r.paused ? 'Paused at ' + fmt(r.left) + ' · ' + r.every + ' min'
          : r.snoozed ? 'Snoozed · back ' + next : r.every + ' min · next ' + next
        const pill = row.querySelector('.snooze'), show = offered(r)
        if (show && pill.hidden !== false) { pill.hidden = false; pill.classList.remove('enter'); void pill.offsetWidth; pill.classList.add('enter') }
        pill.hidden = !show
        row.querySelector('.uline > div').style.width = (p * 100) + '%'
      } else if (view === 'hy') {
        t.textContent = fmt(r.left)
        // Hover line: just the interval (no next/back times).
        sub.textContent = (r.paused ? 'Paused · ' : r.snoozed ? 'Snoozed · ' : '') + 'every ' + r.every + ' min'
        row.classList.toggle('offered', offered(r))
        const arc = row.querySelector('.arc')
        arc.setAttribute('stroke-dashoffset', arc.dataset.c * (1 - p))
      } else {
        t.textContent = fmt(r.left)
        if (offered(r)) {
          // Build the Snooze link once, so a click never lands on a replaced element.
          if (sub.dataset.mode !== 'snooze') {
            sub.dataset.mode = 'snooze'
            sub.innerHTML = '<button class="link">Snooze 5 min</button>'
            sub.firstChild.addEventListener('click', (e) => { e.stopPropagation(); act(r.id, 'snooze') })
          }
        } else {
          sub.dataset.mode = 'text'
          sub.textContent = r.paused ? 'Paused' : r.snoozed ? 'Snoozed · back ' + next : 'next ' + next
        }
        row.querySelector('.arc').setAttribute('stroke-dashoffset', C * (1 - p))
      }
    }
  }
}

function tick(now) {
  const dt = Math.min(1000, now - last) * speed; last = now
  sim += dt
  for (const r of state) {
    if (r.paused) continue
    r.left -= dt
    if (r.left <= 0) fire(r)
  }
  update()
  requestAnimationFrame(tick)
}

// ---- controls
function segmented(id, onPick) {
  for (const b of document.querySelectorAll('#' + id + ' button')) b.addEventListener('click', () => {
    document.querySelectorAll('#' + id + ' button').forEach((x) => x.classList.toggle('on', x === b)); onPick(b.dataset.v)
  })
}
segmented('speed', (v) => { speed = Number(v) })
segmented('theme', (v) => { document.documentElement.dataset.theme = v })
document.getElementById('fire').addEventListener('click', () => { const w = state.find((r) => r.id === 'water'); w.paused = false; w.left = 1200 })
document.getElementById('restart').addEventListener('click', restart)

restart()
requestAnimationFrame(tick)
</script>
</body></html>`

writeFileSync(join(HERE, 'prototype.html'), html)
console.log('wrote prototype.html')
