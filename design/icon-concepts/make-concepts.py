"""Draws Otium app-icon concepts as SVG, plus a comparison sheet (index.html).

Each concept has:
  <name>-app.svg   the full-colour app icon on the macOS 1024 grid
  <name>-menubar.svg  a one-colour glyph for the menu bar (macOS tints it)

Run from the project root:  python3 design/icon-concepts/make-concepts.py
"""
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))

SAGE_TOP, SAGE_BOTTOM = "#6E9A89", "#3E6A5B"  # the app's accent, as a gentle gradient
STONE_TOP, STONE_BOTTOM = "#F4EFE4", "#E3D9C6"  # warm travertine, for the Roman monogram


def polar(cx, cy, r, deg):
    """Point on a circle; 0deg = 12 o'clock, clockwise."""
    a = math.radians(deg - 90)
    return cx + r * math.cos(a), cy + r * math.sin(a)


def arc(cx, cy, r, start, end):
    x1, y1 = polar(cx, cy, r, start)
    x2, y2 = polar(cx, cy, r, end)
    large = 1 if (end - start) % 360 > 180 else 0
    return f"M {x1:.1f} {y1:.1f} A {r} {r} 0 {large} 1 {x2:.1f} {y2:.1f}"


# ---------------------------------------------------------------- glyphs
# Each glyph is drawn in a 1024 box around the centre (512, 512) using `c`
# for the main colour and `soft` for secondary strokes.

def orbit(c, soft):
    return f"""
  <circle cx="512" cy="512" r="250" fill="none" stroke="{soft}" stroke-width="64"/>
  <path d="{arc(512, 512, 250, 0, 270)}" fill="none" stroke="{c}" stroke-width="64" stroke-linecap="round"/>
  <circle cx="512" cy="512" r="46" fill="{c}"/>"""


def sundial(c, soft):
    # Roman sundial: a half dial with soft hour dots, a tapered shadow, and the sun.
    cx, cy = 512, 650
    dots = "".join(
        f'<circle cx="{polar(cx, cy, 262, a)[0]:.1f}" cy="{polar(cx, cy, 262, a)[1]:.1f}" r="17" fill="{soft}"/>'
        for a in (-75, -50, -25, 0, 25, 50, 75)
    )
    tip = polar(cx, cy, 225, -38)
    left = polar(cx, cy, 30, -38 - 90)
    right = polar(cx, cy, 30, -38 + 90)
    sun = polar(cx, cy, 345, 38)
    return f"""
  <path d="{arc(cx, cy, 320, -90, 90)}" fill="none" stroke="{c}" stroke-width="34" stroke-linecap="round"/>
  <line x1="{cx - 320}" y1="{cy}" x2="{cx + 320}" y2="{cy}" stroke="{c}" stroke-width="34" stroke-linecap="round"/>
  {dots}
  <path d="M {left[0]:.1f} {left[1]:.1f} L {tip[0]:.1f} {tip[1]:.1f} L {right[0]:.1f} {right[1]:.1f} Z" fill="{c}" fill-opacity="0.55"/>
  <circle cx="{cx}" cy="{cy}" r="30" fill="{c}"/>
  <circle cx="{sun[0]:.1f}" cy="{sun[1]:.1f}" r="52" fill="{c}"/>"""


def monogram(c, soft):
    # A Roman-inscription "O": thick sides, thin top and bottom, stress tilted left.
    return f"""
  <g transform="rotate(-14 512 512)">
    <path fill="{c}" fill-rule="evenodd" d="
      M 512 205 A 262 307 0 1 1 511.9 205 Z
      M 512 252 A 168 260 0 1 0 512.1 252 Z"/>
  </g>"""


def leaf(c, soft):
    # The vein is cut out of the leaf (a mask), so it shows in any colour scheme.
    return f"""
  <defs>
    <mask id="vein" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">
      <rect width="1024" height="1024" fill="#fff"/>
      <path d="M 512 372 L 512 676" stroke="#000" stroke-width="22" stroke-linecap="round" transform="rotate(38 512 512)"/>
    </mask>
  </defs>
  <circle cx="512" cy="512" r="275" fill="none" stroke="{soft}" stroke-width="40"/>
  <path mask="url(#vein)" fill="{c}" transform="rotate(38 512 512)" d="M 512 300 C 655 380 655 620 512 724 C 369 620 369 380 512 300 Z"/>"""


def breath(c, soft):
    return f"""
  <circle cx="512" cy="512" r="300" fill="{c}" fill-opacity="0.18"/>
  <circle cx="512" cy="512" r="215" fill="{c}" fill-opacity="0.38"/>
  <circle cx="512" cy="512" r="128" fill="{c}"/>"""


def dusk(c, soft):
    return f"""
  <path d="M 342 585 A 170 170 0 0 1 682 585 Z" fill="{c}"/>
  <line x1="236" y1="585" x2="788" y2="585" stroke="{c}" stroke-width="38" stroke-linecap="round"/>
  <line x1="352" y1="672" x2="672" y2="672" stroke="{soft}" stroke-width="34" stroke-linecap="round"/>
  <line x1="436" y1="752" x2="588" y2="752" stroke="{soft}" stroke-width="30" stroke-linecap="round"/>"""


CONCEPTS = [
    ("orbit", "Orbit", orbit, "sage",
     "A progress ring, the same visual language as the Glance view. Says 'timer' and 'calm' at once, and stays crisp at 16px."),
    ("sundial", "Sundial", sundial, "sage",
     "A Roman sundial: the shadow moves, the day passes. Ties the Latin name to timed breaks; the most story-rich option, a little detailed at 16px."),
    ("monogram", "Monogram", monogram, "stone",
     "A carved Roman-inscription 'O' for Otium on warm travertine. Distinctive and brand-led rather than literal."),
    ("leaf", "Leaf", leaf, "sage",
     "Wellness inside a ring: rest and nature within a cycle. Friendly, but closer to generic health apps."),
    ("breath", "Breath", breath, "sage",
     "Concentric circles like a slow breath or a ripple. The quietest option; reads well as a tiny dot in the menu bar."),
    ("dusk", "Dusk", dusk, "sage",
     "The sun at the horizon: 'time to step away'. Warm and narrative; the reflection lines soften it."),
]


def app_icon(glyph, palette):
    if palette == "stone":
        top, bottom, c, soft = STONE_TOP, STONE_BOTTOM, "#3E6A5B", "#3E6A5B"
    else:
        top, bottom, c, soft = SAGE_TOP, SAGE_BOTTOM, "#FFFFFF", "rgba(255,255,255,0.32)"
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.16"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="100" y="100" width="824" height="824" rx="185" fill="url(#bg)"/>
  <rect x="100" y="100" width="824" height="824" rx="185" fill="url(#sheen)"/>
  {glyph(c, soft)}
</svg>
"""


def menubar_glyph(glyph):
    # Black on transparent; macOS recolours template images for light/dark menu bars.
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="150 150 724 724">
  {glyph("#000000", "rgba(0,0,0,0.38)")}
</svg>
"""


def main():
    rows = []
    for key, name, glyph, palette, note in CONCEPTS:
        app = app_icon(glyph, palette)
        bar = menubar_glyph(glyph)
        with open(os.path.join(HERE, f"{key}-app.svg"), "w") as f:
            f.write(app)
        with open(os.path.join(HERE, f"{key}-menubar.svg"), "w") as f:
            f.write(bar)
        rows.append((key, name, note))

    cards = []
    for i, (key, name, note) in enumerate(rows, 1):
        sizes = "".join(
            f'<figure><img src="{key}-app.svg" width="{s}" height="{s}" alt=""><figcaption>{s}</figcaption></figure>'
            for s in (128, 64, 32, 16)
        )
        cards.append(f"""
    <article class="card">
      <div class="hero"><img src="{key}-app.svg" width="220" height="220" alt="{name} app icon"></div>
      <div class="info">
        <h2><span class="num">{i}</span>{name}</h2>
        <p>{note}</p>
        <div class="sizes">{sizes}</div>
        <div class="bars">
          <div class="bar light"><span>9:41</span><img class="glyph" src="{key}-menubar.svg" alt=""><span class="dots"></span></div>
          <div class="bar dark"><span>9:41</span><img class="glyph inv" src="{key}-menubar.svg" alt=""><span class="dots"></span></div>
        </div>
        <div class="dock"><img src="{key}-app.svg" width="56" height="56" alt=""></div>
      </div>
    </article>""")

    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Otium icon concepts</title>
<style>
  :root {{ --bg:#F7F7F5; --card:#FFFFFF; --border:#E7E7E3; --text:#1D1D1F; --muted:#6E6E73; }}
  * {{ box-sizing: border-box; }}
  body {{ margin:0; padding:40px; background:var(--bg); color:var(--text);
         font: 14px/1.45 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; width:1200px; }}
  header h1 {{ margin:0 0 4px; font-size:26px; letter-spacing:-0.01em; }}
  header p {{ margin:0 0 28px; color:var(--muted); }}
  .grid {{ display:grid; grid-template-columns: 1fr 1fr; gap:20px; }}
  .card {{ display:flex; gap:22px; background:var(--card); border:1px solid var(--border); border-radius:18px; padding:22px; }}
  .hero img {{ display:block; filter: drop-shadow(0 10px 18px rgba(0,0,0,0.18)); }}
  .info {{ flex:1; min-width:0; }}
  h2 {{ margin:2px 0 6px; font-size:18px; display:flex; align-items:center; gap:10px; }}
  .num {{ display:inline-grid; place-items:center; width:24px; height:24px; border-radius:50%; background:#E8EFEC; color:#3E6A5B; font-size:12px; }}
  p {{ margin:0 0 14px; color:var(--muted); font-size:13px; }}
  .sizes {{ display:flex; align-items:flex-end; gap:14px; margin-bottom:14px; }}
  figure {{ margin:0; text-align:center; }}
  figcaption {{ font-size:10px; color:var(--muted); margin-top:2px; }}
  .bars {{ display:flex; gap:8px; margin-bottom:12px; }}
  .bar {{ display:flex; align-items:center; gap:10px; height:26px; padding:0 10px; border-radius:6px; font-size:12px; font-weight:500; }}
  .bar.light {{ background:#ECECEC; color:#1D1D1F; }}
  .bar.dark {{ background:#2A2A2C; color:#F2F2F2; }}
  .glyph {{ width:16px; height:16px; }}
  .glyph.inv {{ filter: invert(1); }}
  .dots {{ width:28px; height:6px; border-radius:3px; background:currentColor; opacity:.25; }}
  .dock {{ display:inline-flex; padding:8px 12px; border-radius:16px; background:linear-gradient(#d9e2ea,#c7d1db); }}
</style></head>
<body>
  <header>
    <h1>Otium · app icon concepts</h1>
    <p>Each concept at real sizes (128 → 16px), as a one-colour menu bar icon (light and dark), and in a Dock-style tile.</p>
  </header>
  <section class="grid">{''.join(cards)}
  </section>
</body></html>
"""
    with open(os.path.join(HERE, "index.html"), "w") as f:
        f.write(html)
    print("wrote", len(rows), "concepts and index.html")


main()
