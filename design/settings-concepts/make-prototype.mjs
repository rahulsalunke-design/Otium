// Clickable prototype: four ways to organise Otium's Settings.
// Writes prototype.html next to this script.
// Run from the project root:  node design/settings-concepts/make-prototype.mjs
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  Bell, ChevronLeft, ChevronRight, Eye, Footprints, GlassWater, LayoutGrid, List, Move, Palette, Pause, Pencil, PersonStanding,
  Pill, Play, Plus, Power, SlidersHorizontal, Trash2, Volume2, Wind, Coffee, Sparkles, Info
} from 'lucide-react'

const HERE = dirname(fileURLToPath(import.meta.url))
const svg = (Icon, size = 16, extra = {}) =>
  renderToStaticMarkup(createElement(Icon, { size, strokeWidth: 1.75, 'aria-hidden': true, ...extra }))
const I = {
  stand: svg(PersonStanding, 15), water: svg(GlassWater, 15), eye: svg(Eye, 15), bell: svg(Bell, 15), move: svg(Move, 15),
  walk: svg(Footprints, 15), breathe: svg(Wind, 15), coffee: svg(Coffee, 15), pill: svg(Pill, 15), sparkles: svg(Sparkles, 15),
  back: svg(ChevronLeft, 18), chev: svg(ChevronRight, 15), gear: svg(SlidersHorizontal, 15), power: svg(Power, 15),
  list: svg(List, 14), grid: svg(LayoutGrid, 14), pencil: svg(Pencil, 14), plus: svg(Plus, 15), trash: svg(Trash2, 15),
  speaker: svg(Volume2, 14), play: svg(Play, 12, { fill: 'currentColor', strokeWidth: 1 }), pause: svg(Pause, 12, { fill: 'currentColor', strokeWidth: 1 }),
  palette: svg(Palette, 15), info: svg(Info, 15), bellTile: svg(Bell, 15)
}

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Otium · Settings organisation prototype</title>
<style>
  :root { --page:#111113; --bg:#1c1c1e; --surface:#262628; --border:#333336; --text:#f2f2f2; --muted:#98989d; --faint:#6a6a6f;
          --track:#38383b; --accent:#7fb09f; --accent-soft:rgba(127,176,159,.16); --hover:rgba(255,255,255,.06); --danger:#e08a76; }
  * { box-sizing:border-box; }
  body { margin:0; padding:28px 32px 48px; background:var(--page); color:var(--text); font:13px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif; -webkit-font-smoothing:antialiased; }
  button { font:inherit; color:inherit; border:0; background:none; padding:0; cursor:pointer; }
  button:focus-visible { outline:2px solid var(--accent); outline-offset:-2px; }
  h1 { margin:0 0 4px; font-size:22px; } .lede { margin:0 0 24px; color:var(--muted); max-width:900px; }
  .stage { display:flex; flex-wrap:wrap; gap:40px; align-items:flex-start; }
  .proto h2 { margin:0 0 4px; font-size:15px; display:flex; align-items:center; gap:8px; }
  .k { display:inline-grid; place-items:center; width:22px; height:22px; border-radius:6px; background:var(--accent-soft); color:var(--accent); font-size:12px; }
  .proto .what { margin:0 0 10px; color:var(--muted); font-size:12px; max-width:320px; min-height:34px; }
  .notes { margin:12px 2px 0; padding:0; list-style:none; font-size:12px; color:var(--muted); max-width:320px; }
  .notes li { margin:4px 0; padding-left:16px; position:relative; }
  .notes li.pro::before { content:'+'; position:absolute; left:2px; color:var(--accent); font-weight:700; }
  .notes li.con::before { content:'–'; position:absolute; left:3px; color:var(--danger); font-weight:700; }

  .panel { width:320px; height:560px; background:var(--bg); border-radius:12px; border:1px solid #2c2c2e; box-shadow:0 18px 50px rgba(0,0,0,.55);
           overflow:hidden; display:flex; flex-direction:column; position:relative; }
  .hdr { flex:none; display:flex; align-items:center; gap:6px; height:44px; padding:0 10px 0 12px; }
  .hdr .title { flex:1; font-weight:600; font-size:14px; } .hdr .title.center { text-align:center; }
  .hdr .ib { width:28px; height:28px; display:grid; place-items:center; border-radius:8px; color:var(--muted); } .hdr .ib:hover { background:var(--hover); color:var(--text); }
  .back { display:flex; align-items:center; gap:0; color:var(--accent); font-size:13px; padding:4px 6px 4px 0; border-radius:6px; }
  .back:hover { background:var(--hover); }
  .seg { display:flex; padding:2px; border-radius:8px; background:var(--hover); } .seg i { width:26px; height:22px; display:grid; place-items:center; border-radius:6px; font-style:normal; color:var(--muted); }
  .seg i.on { background:var(--surface); color:var(--text); }
  .body { flex:1; overflow-y:auto; padding:0 12px 12px; }
  .foot { flex:none; display:flex; justify-content:flex-end; gap:8px; padding:10px 12px; border-top:1px solid var(--border); background:var(--bg); }
  .btn { height:28px; padding:0 14px; border-radius:8px; font-weight:500; border:1px solid var(--border); background:var(--surface); }
  .btn.primary { background:var(--accent); border-color:var(--accent); color:#13201c; }
  .btn.link { border:0; background:none; color:var(--accent); padding:0 4px; }
  .note-auto { flex:1; align-self:center; font-size:11px; color:var(--faint); }

  .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; }
  .gtitle { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; color:var(--muted); margin:14px 2px 8px; }
  .gtitle:first-child { margin-top:4px; }
  .rows > * + * { border-top:1px solid var(--border); }
  .row { display:flex; align-items:center; gap:10px; min-height:44px; padding:0 10px 0 12px; width:100%; text-align:left; }
  button.row:hover { background:var(--hover); }
  .chip { display:grid; place-items:center; flex:none; width:26px; height:26px; border-radius:7px; background:var(--accent-soft); color:var(--accent); }
  .tile { display:grid; place-items:center; flex:none; width:26px; height:26px; border-radius:7px; color:#fff; }
  .row .t { flex:1; min-width:0; display:flex; flex-direction:column; } .row .t b { font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .row .t span { font-size:11px; color:var(--faint); }
  .val { color:var(--muted); font-size:12px; white-space:nowrap; } .chev { color:var(--faint); display:grid; place-items:center; transition:transform .2s ease; }
  .off .chip { background:var(--hover); color:var(--faint); } .off .t b { color:var(--muted); }
  .sw { appearance:none; flex:none; width:30px; height:18px; border-radius:9px; background:var(--track); position:relative; cursor:pointer; transition:background .15s; margin:0; }
  .sw::before { content:''; position:absolute; top:2px; left:2px; width:14px; height:14px; border-radius:50%; background:#fff; transition:transform .15s; }
  .sw:checked { background:var(--accent); } .sw:checked::before { transform:translateX(12px); }
  .minchip { font-size:12px; color:var(--text); background:var(--bg); border:1px solid var(--border); border-radius:7px; padding:3px 8px; font-variant-numeric:tabular-nums; flex:none; }
  .add { display:flex; align-items:center; justify-content:center; gap:6px; height:36px; width:100%; color:var(--accent); font-weight:500; }
  .add:hover { background:var(--accent-soft); }

  .themes { display:grid; grid-template-columns:repeat(4,1fr); gap:10px 4px; padding:12px 8px; }
  .topt { display:flex; flex-direction:column; align-items:center; gap:5px; font-size:11px; color:var(--muted); }
  .tdot { position:relative; width:32px; height:32px; border-radius:50%; border:1px solid var(--border); }
  .tdot i { position:absolute; right:-2px; bottom:-2px; width:12px; height:12px; border-radius:50%; border:2px solid var(--surface); }
  .topt.sel { color:var(--text); font-weight:600; } .topt.sel .tdot { box-shadow:0 0 0 2px var(--surface), 0 0 0 4px var(--accent); }
  .line { display:flex; align-items:center; justify-content:space-between; min-height:40px; padding:0 12px; }

  .editrow { padding:8px 10px 8px 12px; } .editrow .main { display:flex; align-items:center; gap:8px; }
  .editrow input.name { flex:1; min-width:0; height:28px; padding:0 8px; background:var(--bg); border:1px solid var(--border); border-radius:8px; color:var(--text); font:inherit; font-weight:600; }
  .editrow .nm { flex:1; font-weight:600; }
  .soundline { display:flex; align-items:center; gap:8px; margin:6px 0 0 34px; color:var(--faint); }
  .sndsel { height:24px; padding:0 22px 0 8px; font-size:12px; color:var(--muted); background:var(--bg); border:1px solid var(--border); border-radius:6px; appearance:none; font-family:inherit; }
  .mini-ib { width:22px; height:22px; display:grid; place-items:center; border-radius:6px; color:var(--muted); } .mini-ib:hover { background:var(--hover); color:var(--text); }

  .detail { display:flex; flex-direction:column; gap:12px; padding-top:6px; }
  .bigicon { display:flex; flex-direction:column; align-items:center; gap:8px; padding:10px 0 4px; }
  .bigicon .chip { width:52px; height:52px; border-radius:14px; } .bigicon .chip svg { width:26px; height:26px; }
  .stepper { display:flex; align-items:center; gap:0; border:1px solid var(--border); border-radius:8px; overflow:hidden; }
  .stepper button { width:30px; height:28px; color:var(--muted); font-size:16px; } .stepper button:hover { background:var(--hover); color:var(--text); }
  .stepper span { min-width:64px; text-align:center; font-variant-numeric:tabular-nums; }
  .igrid { display:grid; grid-template-columns:repeat(5,1fr); gap:6px; padding:10px; }
  .igrid button { height:34px; display:grid; place-items:center; border-radius:8px; color:var(--muted); } .igrid button:hover { background:var(--hover); }
  .igrid button.on { background:var(--accent-soft); color:var(--accent); box-shadow:inset 0 0 0 1px var(--accent); }
  .danger { color:var(--danger); font-weight:500; text-align:center; padding:10px; width:100%; }

  /* motion */
  @keyframes inR { from { transform:translateX(40px); opacity:0 } to { transform:none; opacity:1 } }
  @keyframes inL { from { transform:translateX(-40px); opacity:0 } to { transform:none; opacity:1 } }
  @keyframes fade { from { opacity:0; transform:translateY(4px) } to { opacity:1; transform:none } }
  .enter-fwd { animation: inR .22s ease-out; } .enter-back { animation: inL .22s ease-out; } .enter-fade { animation: fade .2s ease-out; }
  .acc { display:grid; grid-template-rows:0fr; transition:grid-template-rows .25s ease; } .acc > div { overflow:hidden; }
  .acc.open { grid-template-rows:1fr; } .open-chev { transform:rotate(90deg); }
  .expand { display:grid; grid-template-rows:0fr; transition:grid-template-rows .22s ease; } .expand > div { overflow:hidden; } .expand.open { grid-template-rows:1fr; }

  /* list mock for option 3 */
  .lrow { display:flex; align-items:center; gap:10px; height:46px; padding:0 10px; }
  .ring { width:30px; height:30px; border-radius:50%; display:grid; place-items:center; color:var(--accent); background:conic-gradient(var(--accent) var(--p), var(--track) 0); position:relative; flex:none; }
  .ring::before { content:''; position:absolute; inset:3px; border-radius:50%; background:var(--surface); } .ring svg { position:relative; width:14px; height:14px; }
  .time { font-size:17px; font-weight:300; font-variant-numeric:tabular-nums; } .pb { width:26px; height:26px; border-radius:7px; display:grid; place-items:center; background:var(--accent-soft); color:var(--accent); }
</style></head><body>
  <h1>Otium · organising Settings</h1>
  <p class="lede">Four ways to stop Settings from becoming one long scroll. Each panel works: click through it. Same data everywhere (three built-in reminders, one of your own, Sage theme). Nothing here changes the real app.</p>
  <div class="stage">
    <div class="proto"><h2><span class="k">1</span>Tabs</h2><p class="what">One Settings screen, a Reminders | Appearance switch at the top. Cancel / Save stay pinned at the bottom.</p>
      <div class="panel" id="p1"></div>
      <ul class="notes"><li class="pro">Smallest change from today; one Save for everything.</li><li class="pro">Appearance is one click away.</li><li class="con">The Reminders tab is still long with many reminders.</li></ul></div>
    <div class="proto"><h2><span class="k">2</span>Drill-down</h2><p class="what">Like macOS System Settings: a short home screen; each reminder gets its own page. Changes save as you make them.</p>
      <div class="panel" id="p2"></div>
      <ul class="notes"><li class="pro">Every screen stays short, however many reminders you add.</li><li class="pro">Room to grow (Notifications, About…).</li><li class="con">More clicks to reach one setting.</li></ul></div>
    <div class="proto"><h2><span class="k">3</span>Split</h2><p class="what">⚙ is only Appearance. Reminders are edited from the main list: Edit → click a row to open its details in place.</p>
      <div class="panel" id="p3"></div>
      <ul class="notes"><li class="pro">Edit reminders where you see them; Settings becomes tiny.</li><li class="pro">Clear mental model: list = what, ⚙ = look.</li><li class="con">Adds an Edit mode to the main panel.</li></ul></div>
    <div class="proto"><h2><span class="k">4</span>Collapsible sections</h2><p class="what">One page, sections open one at a time. Closed sections show a summary.</p>
      <div class="panel" id="p4"></div>
      <ul class="notes"><li class="pro">Everything on one page, but short by default.</li><li class="pro">Summaries show current choices at a glance.</li><li class="con">An open Reminders section is as long as today.</li></ul></div>
  </div>

<script>
const I = ${JSON.stringify(I)}
const THEMES = [['Sage','#f7f7f5','#1c1c1e','#4f7f6f'],['Dusk','#faf5f0','#221c22','#c26a43'],['Dawn','#fdf6f5','#1f1b1e','#c96a7e'],['Travertine','#f1ece2','#22201b','#6c7745'],['Tide','#f4f7f9','#171c20','#33769f'],['Graphite','#f5f5f5','#161616','#2b2b2b']]
const SOUNDS = ['Chime','Droplet','Rise','Bowl','None']
const ICONS = ['stand','water','eye','move','walk','breathe','coffee','pill','sparkles','bell']
const fresh = () => ({
  theme: 'Sage', glass: false,
  reminders: [
    { id:'stand', name:'Stand up', icon:'stand', min:45, on:true, sound:'Rise', builtIn:true },
    { id:'water', name:'Water', icon:'water', min:60, on:true, sound:'Droplet', builtIn:true },
    { id:'eyes', name:'Eye break', icon:'eye', min:20, on:true, sound:'Bowl', builtIn:true },
    { id:'test', name:'Test123', icon:'bell', min:30, on:true, sound:'Chime', builtIn:false }
  ]
})
const find = (d, id) => d.reminders.find((r) => r.id === id)
const onCount = (d) => d.reminders.filter((r) => r.on).length

// ---------- shared pieces
const hdr = (left, title, right = '', center = false) => '<div class="hdr">' + left + '<span class="title ' + (center ? 'center' : '') + '">' + title + '</span>' + right + '</div>'
const backBtn = (label, act) => '<button class="back" data-act="' + act + '">' + I.back + label + '</button>'
const themesHtml = (d) => '<div class="themes">' + THEMES.map(([n, l, k, a]) =>
  '<button class="topt ' + (d.theme === n ? 'sel' : '') + '" data-act="theme" data-v="' + n + '"><span class="tdot" style="background:linear-gradient(135deg,' + l + ' 0 50%,' + k + ' 50% 100%)"><i style="background:' + a + '"></i></span>' + n + '</button>').join('') +
  '<button class="topt ' + (d.theme === 'Follow day' ? 'sel' : '') + '" data-act="theme" data-v="Follow day"><span class="tdot" style="background:conic-gradient(from 200deg,#fdf6f5 0 33%,#f7f7f5 0 66%,#221c22 0)"></span>Follow day</button></div>'
const glassLine = (d) => '<label class="line"><span>Glass background</span><input type="checkbox" class="sw" data-act="glass" ' + (d.glass ? 'checked' : '') + '></label>'
const appearanceCard = (d) => '<div class="card">' + themesHtml(d) + '<div style="border-top:1px solid var(--border)">' + glassLine(d) + '</div></div>'
const soundSel = (r) => '<select class="sndsel" data-act="sound" data-id="' + r.id + '">' + SOUNDS.map((s) => '<option ' + (s === r.sound ? 'selected' : '') + '>' + s + '</option>').join('') + '</select>'
const editRow = (r) => '<div class="editrow ' + (r.on ? '' : 'off') + '"><div class="main"><input type="checkbox" class="sw" data-act="toggle" data-id="' + r.id + '" ' + (r.on ? 'checked' : '') + '>' +
  '<span class="chip">' + I[r.icon] + '</span>' + (r.builtIn ? '<span class="nm">' + r.name + '</span>' : '<input class="name" value="' + r.name + '">') +
  '<span class="minchip">' + r.min + ' min</span>' + (r.builtIn ? '<span style="width:22px"></span>' : '<button class="mini-ib">' + I.trash + '</button>') + '</div>' +
  '<div class="soundline">' + I.speaker + soundSel(r) + '<button class="mini-ib">' + I.play + '</button></div></div>'
const reminderEditorCard = (d) =>
  '<div class="gtitle">Built-in</div><div class="card rows">' + d.reminders.filter((r) => r.builtIn).map(editRow).join('') + '</div>' +
  '<div class="gtitle">Your reminders</div><div class="card rows">' + d.reminders.filter((r) => !r.builtIn).map(editRow).join('') + '<button class="add">' + I.plus + 'Add reminder</button></div>'
const detailBody = (r) =>
  '<div class="detail"><div class="bigicon"><span class="chip">' + I[r.icon] + '</span>' + (r.builtIn ? '<b>' + r.name + '</b>' : '<input class="name" style="text-align:center;width:180px;height:30px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font:inherit;font-weight:600" value="' + r.name + '">') + '</div>' +
  '<div class="card rows"><label class="line"><span>On</span><input type="checkbox" class="sw" data-act="toggle" data-id="' + r.id + '" ' + (r.on ? 'checked' : '') + '></label>' +
  '<div class="line"><span>Repeat every</span><span class="stepper"><button data-act="min-" data-id="' + r.id + '">–</button><span>' + r.min + ' min</span><button data-act="min+" data-id="' + r.id + '">+</button></span></div>' +
  '<div class="line"><span>Sound</span><span style="display:flex;gap:6px;align-items:center">' + soundSel(r) + '<button class="mini-ib">' + I.play + '</button></span></div></div>' +
  '<div class="gtitle" style="margin-top:2px">Icon</div><div class="card igrid">' + ICONS.map((ic) => '<button class="' + (ic === r.icon ? 'on' : '') + '" data-act="icon" data-id="' + r.id + '" data-v="' + ic + '">' + I[ic] + '</button>').join('') + '</div>' +
  (r.builtIn ? '<p style="text-align:center;color:var(--faint);font-size:11px;margin:0">Built-in reminders can be switched off but not deleted.</p>' : '<div class="card"><button class="danger">Delete reminder</button></div>') + '</div>'

// Generic handler for data edits shared by all four prototypes.
function applyEdit(d, el) {
  const a = el.dataset.act, r = el.dataset.id && find(d, el.dataset.id)
  if (a === 'theme') d.theme = el.dataset.v
  else if (a === 'glass') d.glass = el.checked
  else if (a === 'toggle') r.on = el.checked
  else if (a === 'sound') r.sound = el.value
  else if (a === 'icon') r.icon = el.dataset.v
  else if (a === 'min-') r.min = Math.max(1, r.min - 5)
  else if (a === 'min+') r.min = Math.min(240, r.min + 5)
  else return false
  return true
}

function mount(id, view) {
  const el = document.getElementById(id)
  const st = { d: fresh(), anim: '' }
  const render = () => { el.innerHTML = view.render(st); if (st.anim) { el.querySelector('.anim')?.classList.add(st.anim); st.anim = '' } }
  el.addEventListener('click', (e) => { const t = e.target.closest('[data-act]'); if (!t || t.tagName === 'INPUT' || t.tagName === 'SELECT') return; if (view.act(st, t) !== false || applyEdit(st.d, t)) render() })
  el.addEventListener('change', (e) => { const t = e.target.closest('[data-act]'); if (t && applyEdit(st.d, t)) render() })
  render()
}

// ---------- 1 · Tabs
mount('p1', {
  render: (st) => { st.tab = st.tab || 'rem'
    return hdr(backBtn('', 'noop'), 'Settings', '<span class="ib">' + I.power + '</span>', true) +
      '<div style="padding:0 12px 8px"><div class="seg" style="width:100%"><i class="' + (st.tab === 'rem' ? 'on' : '') + '" style="flex:1;width:auto;cursor:pointer" data-act="tab" data-v="rem">Reminders</i><i class="' + (st.tab === 'app' ? 'on' : '') + '" style="flex:1;width:auto;cursor:pointer" data-act="tab" data-v="app">Appearance</i></div></div>' +
      '<div class="body anim">' + (st.tab === 'rem' ? reminderEditorCard(st.d) : '<div class="gtitle">Theme</div>' + appearanceCard(st.d)) + '</div>' +
      '<div class="foot"><button class="btn">Cancel</button><button class="btn primary">Save</button></div>' },
  act: (st, t) => { if (t.dataset.act === 'tab') { if (st.tab !== t.dataset.v) { st.tab = t.dataset.v; st.anim = 'enter-fade' } return true } return false }
})

// ---------- 2 · Drill-down
mount('p2', {
  render: (st) => { st.stack = st.stack || ['home']; const top = st.stack[st.stack.length - 1], d = st.d
    if (top === 'home') return hdr('<span style="width:28px"></span>', 'Settings', '<span class="ib">' + I.power + '</span>', true) +
      '<div class="body anim"><div class="card rows" style="margin-top:4px">' +
      '<button class="row" data-act="go" data-v="reminders"><span class="tile" style="background:#4f7f6f">' + I.bellTile + '</span><span class="t"><b>Reminders</b></span><span class="val">' + onCount(d) + ' on</span><span class="chev">' + I.chev + '</span></button>' +
      '<button class="row" data-act="go" data-v="appearance"><span class="tile" style="background:#7563ae">' + I.palette + '</span><span class="t"><b>Appearance</b></span><span class="val">' + d.theme + '</span><span class="chev">' + I.chev + '</span></button></div>' +
      '<div class="card rows" style="margin-top:10px"><div class="row"><span class="tile" style="background:#5c5c60">' + I.info + '</span><span class="t"><b>About Otium</b></span><span class="val">v1</span></div></div></div>' +
      '<div class="foot"><span class="note-auto">Changes save automatically.</span></div>'
    if (top === 'appearance') return hdr(backBtn('Settings', 'back'), '', '') + '<div class="body anim"><div class="gtitle">Appearance</div>' + appearanceCard(d) + '</div>'
    if (top === 'reminders') return hdr(backBtn('Settings', 'back'), '', '') +
      '<div class="body anim"><div class="gtitle">Reminders</div><div class="card rows">' + d.reminders.map((r) =>
        '<div class="row ' + (r.on ? '' : 'off') + '" style="padding-right:4px"><input type="checkbox" class="sw" data-act="toggle" data-id="' + r.id + '" ' + (r.on ? 'checked' : '') + '>' +
        '<button class="row" style="padding:0 6px 0 0;min-height:44px" data-act="go" data-v="r:' + r.id + '"><span class="chip">' + I[r.icon] + '</span><span class="t"><b>' + r.name + '</b><span>every ' + r.min + ' min · ' + r.sound + '</span></span><span class="chev">' + I.chev + '</span></button></div>').join('') +
      '<button class="add">' + I.plus + 'Add reminder</button></div></div>'
    const r = find(d, top.slice(2))
    return hdr(backBtn('Reminders', 'back'), '', '') + '<div class="body anim">' + detailBody(r) + '</div>' },
  act: (st, t) => { if (t.dataset.act === 'go') { st.stack.push(t.dataset.v); st.anim = 'enter-fwd'; return true }
    if (t.dataset.act === 'back') { st.stack.pop(); st.anim = 'enter-back'; return true } return false }
})

// ---------- 3 · Split
mount('p3', {
  render: (st) => { st.mode = st.mode || 'list'; const d = st.d
    if (st.mode === 'list') return hdr('', 'Otium', '<span class="seg"><i class="on">' + I.list + '</i><i>' + I.grid + '</i></span><button class="ib" title="Edit reminders" data-act="mode" data-v="edit">' + I.pencil + '</button><button class="ib" title="Appearance" data-act="mode" data-v="appearance">' + I.gear + '</button><span class="ib">' + I.power + '</span>') +
      '<div class="body anim"><div class="card rows">' + d.reminders.filter((r) => r.on).map((r, i) =>
        '<div class="lrow"><span class="ring" style="--p:' + [52, 64, 48, 70][i % 4] + '%">' + I[r.icon] + '</span><span class="t" style="flex:1;font-weight:600">' + r.name + '</span><span class="time">' + ['23:46','38:46','9:35','20:28'][i % 4] + '</span><span class="pb">' + I.pause + '</span></div>').join('') + '</div>' +
      '<p style="text-align:center;color:var(--faint);font-size:11px;margin-top:14px">Try ✎ (Edit reminders) or ⚙ (Appearance) in the header.</p></div>'
    if (st.mode === 'appearance') return hdr(backBtn('', 'mode-list'), 'Appearance', '<span style="width:28px"></span>', true) +
      '<div class="body anim">' + appearanceCard(d) + '<p style="color:var(--faint);font-size:11px;margin:10px 4px">Settings now only holds the look. Reminders are edited from the list.</p></div>'
    return hdr('<span style="width:44px"></span>', 'Edit reminders', '<button class="btn link" data-act="mode-list">Done</button>', true) +
      '<div class="body anim"><div class="card rows">' + d.reminders.map((r) => {
        const open = st.open === r.id
        return '<div class="' + (r.on ? '' : 'off') + '"><div class="row" style="padding-right:6px"><input type="checkbox" class="sw" data-act="toggle" data-id="' + r.id + '" ' + (r.on ? 'checked' : '') + '>' +
          '<button class="row" style="padding:0" data-act="open" data-v="' + r.id + '"><span class="chip">' + I[r.icon] + '</span><span class="t"><b>' + r.name + '</b></span><span class="minchip">' + r.min + ' min</span><span class="chev ' + (open ? 'open-chev' : '') + '">' + I.chev + '</span></button></div>' +
          '<div class="expand ' + (open ? 'open' : '') + '"><div><div style="padding:2px 12px 12px 52px;display:flex;flex-direction:column;gap:8px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center"><span class="val">Repeat every</span><span class="stepper"><button data-act="min-" data-id="' + r.id + '">–</button><span>' + r.min + ' min</span><button data-act="min+" data-id="' + r.id + '">+</button></span></div>' +
          '<div style="display:flex;justify-content:space-between;align-items:center"><span class="val">Sound</span>' + soundSel(r) + '</div>' +
          '<div style="display:flex;gap:4px;flex-wrap:wrap">' + ICONS.slice(0, 8).map((ic) => '<button class="mini-ib" style="width:26px;height:26px;' + (ic === r.icon ? 'background:var(--accent-soft);color:var(--accent)' : '') + '" data-act="icon" data-id="' + r.id + '" data-v="' + ic + '">' + I[ic] + '</button>').join('') + '</div>' +
          (r.builtIn ? '' : '<button class="danger" style="text-align:left;padding:4px 0">Delete reminder</button>') + '</div></div></div></div>'
      }).join('') + '<button class="add">' + I.plus + 'Add reminder</button></div></div>' },
  act: (st, t) => { const a = t.dataset.act
    if (a === 'mode') { st.mode = t.dataset.v; st.anim = 'enter-fwd'; return true }
    if (a === 'mode-list') { st.mode = 'list'; st.open = null; st.anim = 'enter-back'; return true }
    if (a === 'open') { st.open = st.open === t.dataset.v ? null : t.dataset.v; return true } return false }
})

// ---------- 4 · Collapsible sections
mount('p4', {
  render: (st) => { const d = st.d; st.open = st.open === undefined ? 'appearance' : st.open
    const section = (key, tileBg, icon, title, summary, content) => { const open = st.open === key
      return '<div class="card" style="margin-bottom:10px"><button class="row" data-act="sec" data-v="' + key + '"><span class="tile" style="background:' + tileBg + '">' + icon + '</span><span class="t"><b>' + title + '</b><span>' + summary + '</span></span><span class="chev ' + (open ? 'open-chev' : '') + '">' + I.chev + '</span></button>' +
        '<div class="acc ' + (open ? 'open' : '') + '"><div><div style="border-top:1px solid var(--border)">' + content + '</div></div></div></div>' }
    return hdr(backBtn('', 'noop'), 'Settings', '<span class="ib">' + I.power + '</span>', true) +
      '<div class="body">' +
      section('appearance', '#7563ae', I.palette, 'Appearance', d.theme + ' · Glass ' + (d.glass ? 'on' : 'off'), themesHtml(d) + '<div style="border-top:1px solid var(--border)">' + glassLine(d) + '</div>') +
      section('reminders', '#4f7f6f', I.bellTile, 'Reminders', onCount(d) + ' of ' + d.reminders.length + ' on', '<div class="rows">' + d.reminders.map(editRow).join('') + '<button class="add">' + I.plus + 'Add reminder</button></div>') +
      '</div><div class="foot"><button class="btn">Cancel</button><button class="btn primary">Save</button></div>' },
  act: (st, t) => { if (t.dataset.act === 'sec') { st.open = st.open === t.dataset.v ? null : t.dataset.v; return true } return false }
})
</script>
</body></html>`

writeFileSync(join(HERE, 'prototype.html'), html)
console.log('wrote prototype.html')
