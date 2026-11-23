// Clickable comparison: ways to switch a reminder on or off in Edit reminders.
// Writes prototype.html next to this script.
// Run from the project root:  node design/toggle-concepts/make-prototype.mjs
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Bell, Check, ChevronRight, CircleMinus, CirclePlus, Eye, Footprints, GlassWater, PersonStanding } from 'lucide-react'

const HERE = dirname(fileURLToPath(import.meta.url))
const svg = (Icon, size = 15, extra = {}) =>
  renderToStaticMarkup(createElement(Icon, { size, strokeWidth: 1.75, 'aria-hidden': true, ...extra }))
const I = {
  stand: svg(PersonStanding), water: svg(GlassWater), eye: svg(Eye), bell: svg(Bell), walk: svg(Footprints),
  chev: svg(ChevronRight, 14), check: svg(Check, 13, { strokeWidth: 3 }), minus: svg(CircleMinus, 18), plus: svg(CirclePlus, 18)
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Otium · on/off control options</title>
<style>
  :root { --page:#111113; --bg:#1c1c1e; --surface:#262628; --border:#333336; --text:#f2f2f2; --muted:#98989d; --faint:#6a6a6f;
          --track:#38383b; --accent:#7fb09f; --accent-soft:rgba(127,176,159,.16); --hover:rgba(255,255,255,.06); --danger:#e08a76; }
  * { box-sizing:border-box; }
  body { margin:0; padding:28px 32px 48px; background:var(--page); color:var(--text); font:13px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; -webkit-font-smoothing:antialiased; }
  button { font:inherit; color:inherit; border:0; background:none; padding:0; cursor:pointer; }
  button:focus-visible { outline:2px solid var(--accent); outline-offset:1px; }
  h1 { margin:0 0 4px; font-size:22px; } .lede { margin:0 0 6px; color:var(--muted); max-width:940px; }
  .tip { margin:0 0 24px; color:var(--accent); max-width:940px; font-size:12.5px; }
  .stage { display:grid; grid-template-columns:repeat(3, 320px); gap:34px 44px; align-items:start; }
  .proto h2 { margin:0 0 4px; font-size:15px; display:flex; align-items:center; gap:8px; }
  .k { display:inline-grid; place-items:center; width:22px; height:22px; border-radius:6px; background:var(--accent-soft); color:var(--accent); font-size:12px; }
  .what { margin:0 0 10px; color:var(--muted); font-size:12px; min-height:34px; }
  .notes { margin:10px 2px 0; padding:0; list-style:none; font-size:12px; color:var(--muted); }
  .notes li { margin:3px 0; padding-left:15px; position:relative; }
  .notes li.pro::before { content:'+'; position:absolute; left:2px; color:var(--accent); font-weight:700; }
  .notes li.con::before { content:'–'; position:absolute; left:3px; color:var(--danger); font-weight:700; }

  .panel { width:320px; background:var(--bg); border-radius:12px; border:1px solid #2c2c2e; box-shadow:0 18px 50px rgba(0,0,0,.55); overflow:hidden; }
  .hdr { display:flex; align-items:center; height:44px; padding:0 12px; }
  .hdr span { flex:1; text-align:center; font-weight:600; font-size:14px; } .hdr b { color:var(--muted); font-weight:400; } .hdr i { color:var(--accent); font-weight:600; font-style:normal; }
  .body { padding:0 12px 12px; }
  .list { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
  .row { display:flex; align-items:center; gap:10px; min-height:44px; padding:0 8px 0 12px; transition:background-color .15s, opacity .2s; }
  .row + .row, .gt + .row { border-top:1px solid var(--border); }
  .chip { display:grid; place-items:center; flex:none; width:26px; height:26px; border-radius:7px; background:var(--accent-soft); color:var(--accent); transition:all .18s ease; }
  .name { flex:1; min-width:0; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; transition:color .18s; }
  .min { flex:none; font-size:12px; padding:3px 8px; border-radius:7px; border:1px solid var(--border); background:var(--bg); font-variant-numeric:tabular-nums; }
  .chev { color:var(--faint); display:grid; place-items:center; }
  .row.off .name { color:var(--muted); } .row.off .chip { background:var(--hover); color:var(--faint); } .row.off .min { color:var(--faint); }
  .add { display:flex; align-items:center; justify-content:center; height:36px; color:var(--accent); font-weight:500; border-top:1px solid var(--border); width:100%; }
  .status { padding:10px 2px 0; font-size:11px; color:var(--faint); min-height:24px; }

  /* A switch */
  .sw { appearance:none; flex:none; width:30px; height:18px; border-radius:9px; background:var(--track); position:relative; cursor:pointer; transition:background .15s; margin:0; }
  .sw::before { content:''; position:absolute; top:2px; left:2px; width:14px; height:14px; border-radius:50%; background:#fff; transition:transform .15s; }
  .sw:checked { background:var(--accent); } .sw:checked::before { transform:translateX(12px); }
  /* B check circle */
  .ck { flex:none; width:20px; height:20px; border-radius:50%; border:1.5px solid var(--faint); display:grid; place-items:center; color:transparent; transition:all .15s; }
  .ck:hover { border-color:var(--muted); }
  .ck.on { background:var(--accent); border-color:var(--accent); color:#13201c; }
  /* C icon toggle */
  .ichip { width:30px; height:30px; border-radius:8px; position:relative; }
  .ichip:hover { box-shadow:0 0 0 2px var(--accent-soft); }
  .row.off .ichip { background:transparent; border:1.5px dashed var(--faint); color:var(--faint); }
  .row.off .ichip::after { content:''; position:absolute; left:4px; right:4px; top:50%; height:1.5px; background:var(--faint); transform:rotate(-40deg); }
  /* D groups */
  .gt { font-size:11px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; color:var(--muted); padding:10px 12px 6px; background:var(--bg); }
  .list.grouped { background:transparent; border:0; } .grp { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:10px; }
  .mv { flex:none; display:grid; place-items:center; color:var(--faint); width:24px; height:24px; border-radius:6px; }
  .mv.rm:hover { color:var(--danger); } .mv.ad { color:var(--accent); } .mv:hover { background:var(--hover); }
  .grp-empty { padding:12px; color:var(--faint); font-size:12px; text-align:center; }
  @keyframes arrive { from { background:var(--accent-soft) } to { background:transparent } } .arrive { animation: arrive .9s ease-out; }
  /* E pill */
  .pill { flex:none; min-width:40px; height:24px; padding:0 9px; border-radius:12px; font-size:11.5px; font-weight:600; transition:all .15s; }
  .pill.on { background:var(--accent-soft); color:var(--accent); } .pill.off { background:transparent; color:var(--faint); box-shadow:inset 0 0 0 1px var(--border); }
  .pill:hover { filter:brightness(1.15); }
  /* F inside details */
  .tag { flex:none; font-size:10.5px; font-weight:600; color:var(--faint); border:1px solid var(--border); padding:1px 6px; border-radius:8px; }
  .rowbtn { flex:1; display:flex; align-items:center; gap:10px; min-height:44px; text-align:left; }
  .det { padding:0 12px 12px 48px; display:flex; flex-direction:column; gap:8px; border-top:1px dashed var(--border); padding-top:10px; }
  .det .line { display:flex; justify-content:space-between; align-items:center; color:var(--muted); font-size:12px; }
  .onoff { height:26px; padding:0 12px; border-radius:8px; font-weight:600; font-size:12px; }
  .onoff.turnoff { color:var(--danger); background:rgba(224,138,118,.1); } .onoff.turnon { color:#13201c; background:var(--accent); }
  .det .fake { color:var(--faint); font-size:11px; }
  /* G instant */
  .hdr .back { color:var(--accent); font-weight:500; width:52px; } .hdr .spacer { width:52px; }
  .panel { position:relative; }
  .toast { position:absolute; left:12px; right:12px; bottom:12px; display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px;
           background:#3a3a3c; color:var(--text); font-size:12px; box-shadow:0 8px 24px rgba(0,0,0,.4); transform:translateY(12px); opacity:0; transition:all .2s ease; pointer-events:none; }
  .toast.show { transform:none; opacity:1; pointer-events:auto; } .toast span { flex:1; } .toast button { color:var(--accent); font-weight:600; }
</style></head><body>
  <h1>Otium · switching a reminder on and off</h1>
  <p class="lede">Six ways to do it, each in the Edit reminders panel with the same five reminders (“Take a walk” starts off). Everything is clickable.</p>
  <p class="tip">Good to know: Edit reminders already has Cancel and Done, and nothing is saved until Done. So a checkbox (or any of these) needs no extra Save button.</p>
  <div class="stage" id="stage"></div>

<script>
const I = ${JSON.stringify(I)}
const START = [
  { id:'stand', name:'Stand up', icon:'stand', min:45, on:true },
  { id:'water', name:'Water', icon:'water', min:60, on:true },
  { id:'eyes', name:'Eye break', icon:'eye', min:20, on:true },
  { id:'test', name:'Test123', icon:'bell', min:30, on:true },
  { id:'walk', name:'Take a walk', icon:'walk', min:90, on:false }
]
const header = '<div class="hdr"><b>Cancel</b><span>Edit reminders</span><i>Done</i></div>'
const summary = (rs) => rs.filter((r) => r.on).length + ' of ' + rs.length + ' reminders on'
const chip = (r, extra = '') => '<span class="chip ' + extra + '">' + I[r.icon] + '</span>'
const minChip = (r) => '<span class="min">' + r.min + ' min</span>'

const VARIANTS = [
  { k:'A', title:'Switch', what:'Today’s design: a small switch at the start of each row.',
    notes:['+Familiar from macOS and iOS settings.', '–Reads like an instant setting, but nothing applies until Done.', '–Five switches in a column add visual noise.'],
    row: (r) => '<div class="row ' + (r.on ? '' : 'off') + '"><input type="checkbox" class="sw" data-toggle="' + r.id + '" ' + (r.on ? 'checked' : '') + ' aria-label="' + r.name + ' on or off">' + chip(r) + '<span class="name">' + r.name + '</span>' + minChip(r) + '<span class="chev">' + I.chev + '</span></div>' },
  { k:'B', title:'Check circle', what:'A round tick like Apple Reminders: filled means on, empty means off.',
    notes:['+Calm and light; matches the “list of things” feel.', '+Reads naturally as “include this one”.', '–Some people may read a tick as “done”.'],
    row: (r) => '<div class="row ' + (r.on ? '' : 'off') + '"><button class="ck ' + (r.on ? 'on' : '') + '" data-toggle="' + r.id + '" role="checkbox" aria-checked="' + r.on + '" aria-label="' + r.name + '">' + I.check + '</button>' + chip(r) + '<span class="name">' + r.name + '</span>' + minChip(r) + '<span class="chev">' + I.chev + '</span></div>' },
  { k:'C', title:'Icon as the toggle', what:'Click the reminder’s own icon: coloured is on, grey with a slash is off.',
    notes:['+No extra control at all; the cleanest row.', '+The icon’s colour shows state at a glance.', '–Hard to discover without a hint (tooltip).'],
    row: (r) => '<div class="row ' + (r.on ? '' : 'off') + '"><button class="chip ichip" data-toggle="' + r.id + '" title="' + (r.on ? 'Turn off' : 'Turn on') + '" aria-pressed="' + r.on + '" aria-label="' + r.name + ' ' + (r.on ? 'on' : 'off') + '">' + I[r.icon] + '</button><span class="name">' + r.name + '</span>' + minChip(r) + '<span class="chev">' + I.chev + '</span></div>' },
  { k:'D', title:'On / Off groups', what:'Two sections. ⊖ moves a reminder down to Off, ⊕ brings it back.',
    notes:['+State is the layout: no reading of tiny controls.', '+Off reminders are out of the way.', '–Rows move when you change them, which can disorient.'],
    list: (rs, st) => {
      const row = (r) => '<div class="row ' + (r.on ? '' : 'off') + ' ' + (st.moved === r.id ? 'arrive' : '') + '"><button class="mv ' + (r.on ? 'rm' : 'ad') + '" data-toggle="' + r.id + '" aria-label="' + (r.on ? 'Turn off ' : 'Turn on ') + r.name + '">' + (r.on ? I.minus : I.plus) + '</button>' + chip(r) + '<span class="name">' + r.name + '</span>' + minChip(r) + '<span class="chev">' + I.chev + '</span></div>'
      const on = rs.filter((r) => r.on), off = rs.filter((r) => !r.on)
      return '<div class="list grouped"><div class="gt" style="padding-top:2px">On</div><div class="grp">' + (on.map(row).join('') || '<div class="grp-empty">No reminders on</div>') + '<button class="add">+ Add reminder</button></div>' +
        '<div class="gt">Off</div><div class="grp">' + (off.map(row).join('') || '<div class="grp-empty">Nothing switched off</div>') + '</div></div>' } },
  { k:'E', title:'On / Off label', what:'A small pill at the end of each row that says what it is. Click to flip.',
    notes:['+Explicit words: no guessing what a shape means.', '+Easy to scan down the right edge.', '–Takes the spot of the chevron; slightly busier.'],
    row: (r) => '<div class="row ' + (r.on ? '' : 'off') + '">' + chip(r) + '<span class="name">' + r.name + '</span>' + minChip(r) + '<button class="pill ' + (r.on ? 'on' : 'off') + '" data-toggle="' + r.id + '" aria-pressed="' + r.on + '">' + (r.on ? 'On' : 'Off') + '</button></div>' },
  { k:'F', title:'Inside the details', what:'Rows have no control; off ones are dimmed and tagged. Open a reminder to turn it on or off.',
    notes:['+The cleanest list; matches “click a row to change it”.', '+Turning something off is a deliberate choice.', '–Two clicks instead of one.'],
    list: (rs, st) => '<div class="list">' + rs.map((r) => {
      const open = st.open === r.id
      return '<div class="' + (r.on ? '' : 'row-off') + '"><div class="row ' + (r.on ? '' : 'off') + '" style="padding:0 8px 0 12px"><button class="rowbtn" data-open="' + r.id + '">' + chip(r) + '<span class="name">' + r.name + '</span>' + (r.on ? '' : '<span class="tag">Off</span>') + minChip(r) + '<span class="chev" style="transform:rotate(' + (open ? 90 : 0) + 'deg);transition:transform .2s">' + I.chev + '</span></button></div>' +
        (open ? '<div class="det"><div class="line"><span>Repeat every</span><span class="fake">− ' + r.min + ' min +</span></div><div class="line"><span>Sound</span><span class="fake">Rise ▾</span></div>' +
          '<div class="line"><span>' + (r.on ? 'This reminder is on' : 'This reminder is off') + '</span><button class="onoff ' + (r.on ? 'turnoff' : 'turnon') + '" data-toggle="' + r.id + '">' + (r.on ? 'Turn off' : 'Turn on') + '</button></div></div>' : '') + '</div>'
    }).join('') + '<button class="add">+ Add reminder</button></div>' },
  { k:'G', title:'Switch, no Done', instant:true,
    header:'<div class="hdr"><b class="back">‹ Back</b><span>Edit reminders</span><span class="spacer"></span></div>',
    what:'Like macOS System Settings: flipping a switch takes effect immediately. A short Undo covers mis-clicks.',
    notes:['+The switch finally means what it looks like: instant.', '+One less step; no Cancel / Done to think about.', '–Every other edit (interval, sound, name) would also need to save instantly.'],
    row: (r) => '<div class="row ' + (r.on ? '' : 'off') + '"><input type="checkbox" class="sw" data-toggle="' + r.id + '" ' + (r.on ? 'checked' : '') + ' aria-label="' + r.name + ' on or off">' + chip(r) + '<span class="name">' + r.name + '</span>' + minChip(r) + '<span class="chev">' + I.chev + '</span></div>' }
]

const stage = document.getElementById('stage')
for (const v of VARIANTS) {
  const wrap = document.createElement('div')
  wrap.className = 'proto'
  wrap.innerHTML = '<h2><span class="k">' + v.k + '</span>' + v.title + '</h2><p class="what">' + v.what + '</p><div class="panel">' + (v.header || header) + '<div class="body"></div>' +
    (v.instant ? '<div class="toast" role="status"><span></span><button type="button">Undo</button></div>' : '') + '</div><ul class="notes">' +
    v.notes.map((n) => '<li class="' + (n[0] === '+' ? 'pro' : 'con') + '">' + n.slice(1) + '</li>').join('') + '</ul>'
  stage.appendChild(wrap)
  const st = { rs: START.map((r) => ({ ...r })), open: v.k === 'F' ? 'walk' : null, moved: null }
  const body = wrap.querySelector('.body')
  const render = () => {
    body.innerHTML = (v.list ? v.list(st.rs, st) : '<div class="list">' + st.rs.map(v.row).join('') + '<button class="add">+ Add reminder</button></div>') +
      '<div class="status">' + summary(st.rs) + (v.instant ? ' · applied straight away' : ' · saved when you press Done') + '</div>'
  }
  // G: show "Water turned off · Undo" for a few seconds after each change.
  const toast = wrap.querySelector('.toast')
  const notify = (r) => {
    if (!toast) return
    toast.querySelector('span').textContent = r.name + ' turned ' + (r.on ? 'on' : 'off')
    toast.classList.add('show'); st.last = r.id
    clearTimeout(st.timer); st.timer = setTimeout(() => toast.classList.remove('show'), 4000)
  }
  if (toast) toast.querySelector('button').addEventListener('click', () => {
    const r = st.rs.find((x) => x.id === st.last); if (!r) return
    r.on = !r.on; render(); toast.classList.remove('show')
  })
  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toggle],[data-open]')
    if (!t) return
    if (t.dataset.open) { st.open = st.open === t.dataset.open ? null : t.dataset.open; render(); return }
    if (t.tagName === 'INPUT') return
    const r = st.rs.find((x) => x.id === t.dataset.toggle); r.on = !r.on; st.moved = r.id; render(); st.moved = null
  })
  body.addEventListener('change', (e) => {
    const t = e.target.closest('input[data-toggle]'); if (!t) return
    const r = st.rs.find((x) => x.id === t.dataset.toggle); r.on = t.checked; render(); notify(r)
  })
  render()
}
</script>
</body></html>`

writeFileSync(join(HERE, 'prototype.html'), html)
console.log('wrote prototype.html')
