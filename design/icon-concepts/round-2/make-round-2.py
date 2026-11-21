"""Round 2 of Otium app-icon exploration: variations of Orbit and Dusk.

Writes <key>-app.svg, <key>-menubar.svg and index.html next to this script.
Run from the project root:  python3 design/icon-concepts/round-2/make-round-2.py
"""
import math
import os

HERE = os.path.dirname(os.path.abspath(__file__))

PALETTES = {
    # background top, bottom, main glyph colour, soft glyph colour
    "sage": ("#6E9A89", "#3E6A5B", "#FFFFFF", "rgba(255,255,255,0.32)"),
    "stone": ("#F4EFE4", "#E3D9C6", "#3E6A5B", "rgba(62,106,91,0.28)"),
    "dusk": ("#6E9A89", "#D9A67E", "#FFFFFF", "rgba(255,255,255,0.40)"),
}


def polar(cx, cy, r, deg):
    """Point on a circle; 0deg = 12 o'clock, clockwise."""
    a = math.radians(deg - 90)
    return cx + r * math.cos(a), cy + r * math.sin(a)


def arc(cx, cy, r, start, end):
    x1, y1 = polar(cx, cy, r, start)
    x2, y2 = polar(cx, cy, r, end)
    large = 1 if (end - start) % 360 > 180 else 0
    return f"M {x1:.1f} {y1:.1f} A {r} {r} 0 {large} 1 {x2:.1f} {y2:.1f}"


# ------------------------------------------------------------------ Orbit

def orbit_classic(c, soft, uid):
    return f"""
  <circle cx="512" cy="512" r="250" fill="none" stroke="{soft}" stroke-width="64"/>
  <path d="{arc(512, 512, 250, 0, 270)}" fill="none" stroke="{c}" stroke-width="64" stroke-linecap="round"/>
  <circle cx="512" cy="512" r="46" fill="{c}"/>"""


def orbit_thin(c, soft, uid):
    return f"""
  <circle cx="512" cy="512" r="262" fill="none" stroke="{soft}" stroke-width="38"/>
  <path d="{arc(512, 512, 262, 0, 300)}" fill="none" stroke="{c}" stroke-width="38" stroke-linecap="round"/>
  <circle cx="512" cy="512" r="32" fill="{c}"/>"""


def orbit_head(c, soft, uid):
    hx, hy = polar(512, 512, 250, 270)
    return f"""
  <circle cx="512" cy="512" r="250" fill="none" stroke="{soft}" stroke-width="52"/>
  <path d="{arc(512, 512, 250, 0, 270)}" fill="none" stroke="{c}" stroke-width="52" stroke-linecap="round"/>
  <circle cx="{hx:.1f}" cy="{hy:.1f}" r="62" fill="{c}"/>"""


def orbit_dusk(c, soft, uid):
    # The ring is the day; the sun sets on the horizon inside it.
    return f"""
  <defs><clipPath id="in-{uid}"><circle cx="512" cy="512" r="218"/></clipPath></defs>
  <circle cx="512" cy="512" r="250" fill="none" stroke="{soft}" stroke-width="50"/>
  <path d="{arc(512, 512, 250, 0, 270)}" fill="none" stroke="{c}" stroke-width="50" stroke-linecap="round"/>
  <g clip-path="url(#in-{uid})">
    <path d="M 402 568 A 110 110 0 0 1 622 568 Z" fill="{c}"/>
    <line x1="280" y1="568" x2="744" y2="568" stroke="{c}" stroke-width="28" stroke-linecap="round"/>
    <line x1="430" y1="630" x2="594" y2="630" stroke="{soft}" stroke-width="24" stroke-linecap="round"/>
  </g>"""


# ------------------------------------------------------------------- Dusk

def dusk_classic(c, soft, uid):
    return f"""
  <path d="M 342 585 A 170 170 0 0 1 682 585 Z" fill="{c}"/>
  <line x1="236" y1="585" x2="788" y2="585" stroke="{c}" stroke-width="38" stroke-linecap="round"/>
  <line x1="352" y1="672" x2="672" y2="672" stroke="{soft}" stroke-width="34" stroke-linecap="round"/>
  <line x1="436" y1="752" x2="588" y2="752" stroke="{soft}" stroke-width="30" stroke-linecap="round"/>"""


def dusk_bold(c, soft, uid):
    return f"""
  <path d="M 302 620 A 210 210 0 0 1 722 620 Z" fill="{c}"/>
  <line x1="214" y1="620" x2="810" y2="620" stroke="{c}" stroke-width="48" stroke-linecap="round"/>"""


def dusk_window(c, soft, uid):
    return f"""
  <defs><clipPath id="win-{uid}"><circle cx="512" cy="512" r="262"/></clipPath></defs>
  <circle cx="512" cy="512" r="280" fill="none" stroke="{c}" stroke-width="36"/>
  <g clip-path="url(#win-{uid})">
    <path d="M 377 565 A 135 135 0 0 1 647 565 Z" fill="{c}"/>
    <line x1="230" y1="565" x2="794" y2="565" stroke="{c}" stroke-width="30"/>
    <line x1="400" y1="640" x2="624" y2="640" stroke="{soft}" stroke-width="26" stroke-linecap="round"/>
    <line x1="460" y1="705" x2="564" y2="705" stroke="{soft}" stroke-width="24" stroke-linecap="round"/>
  </g>"""


def dusk_glow(c, soft, uid):
    return f"""
  <circle cx="512" cy="585" r="270" fill="{c}" fill-opacity="0.16"/>
  <path d="M 352 585 A 160 160 0 0 1 672 585 Z" fill="{c}"/>
  <line x1="236" y1="585" x2="788" y2="585" stroke="{c}" stroke-width="36" stroke-linecap="round"/>
  <line x1="372" y1="668" x2="652" y2="668" stroke="{soft}" stroke-width="30" stroke-linecap="round"/>"""


def dusk_rays(c, soft, uid):
    rays = "".join(
        f'<line x1="{polar(512, 600, 200, a)[0]:.1f}" y1="{polar(512, 600, 200, a)[1]:.1f}" '
        f'x2="{polar(512, 600, 262, a)[0]:.1f}" y2="{polar(512, 600, 262, a)[1]:.1f}" '
        f'stroke="{c}" stroke-width="34" stroke-linecap="round"/>'
        for a in (-64, -32, 0, 32, 64)
    )
    return f"""
  <path d="M 362 600 A 150 150 0 0 1 662 600 Z" fill="{c}"/>
  {rays}
  <line x1="236" y1="600" x2="788" y2="600" stroke="{c}" stroke-width="38" stroke-linecap="round"/>
  <line x1="392" y1="684" x2="632" y2="684" stroke="{soft}" stroke-width="30" stroke-linecap="round"/>"""


SECTIONS = [
    ("Orbit", "The Glance view's ring as the brand mark.", [
        ("o1", "O1 · Classic", orbit_classic, "sage", "Round 1 as it was: bold ring, centre dot."),
        ("o2", "O2 · Thin", orbit_thin, "sage", "Lighter strokes, a longer arc. More refined, less sturdy at 16px."),
        ("o3", "O3 · Progress head", orbit_head, "sage", "A dot leads the arc like a clock hand's tip. Feels like time moving."),
        ("o4", "O4 · Stone", orbit_classic, "stone", "Classic ring, sage on warm travertine. Calmer, stands out from green apps."),
        ("o5", "O5 · Orbit × Dusk", orbit_dusk, "sage", "Hybrid: the day's ring with the sun setting inside it."),
    ]),
    ("Dusk", "The sun at the horizon: time to step away.", [
        ("d1", "D1 · Classic", dusk_classic, "sage", "Round 1 as it was: sun, horizon, two reflection lines."),
        ("d2", "D2 · Bold", dusk_bold, "sage", "Bigger sun, one line. The simplest; strongest at 16px."),
        ("d3", "D3 · Window", dusk_window, "sage", "The scene framed in a circle, like looking out a window."),
        ("d4", "D4 · Glow", dusk_glow, "dusk", "Warm dusk light: sage fading to apricot, a soft halo."),
        ("d5", "D5 · Rays", dusk_rays, "sage", "A gentle sunburst: more uplifting, a little busier."),
    ]),
]


def app_icon(glyph, palette, uid):
    top, bottom, c, soft = PALETTES[palette]
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg-{uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{top}"/><stop offset="1" stop-color="{bottom}"/>
    </linearGradient>
    <linearGradient id="sheen-{uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.16"/><stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="100" y="100" width="824" height="824" rx="185" fill="url(#bg-{uid})"/>
  <rect x="100" y="100" width="824" height="824" rx="185" fill="url(#sheen-{uid})"/>
  {glyph(c, soft, uid)}
</svg>
"""


def menubar_glyph(glyph, uid):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="150 150 724 724">
  {glyph("#000000", "rgba(0,0,0,0.38)", uid + "m")}
</svg>
"""


def main():
    sections_html = []
    count = 0
    for title, blurb, variants in SECTIONS:
        cards = []
        for key, name, glyph, palette, note in variants:
            with open(os.path.join(HERE, f"{key}-app.svg"), "w") as f:
                f.write(app_icon(glyph, palette, key))
            with open(os.path.join(HERE, f"{key}-menubar.svg"), "w") as f:
                f.write(menubar_glyph(glyph, key))
            count += 1
            cards.append(f"""
      <article class="card">
        <img class="hero" src="{key}-app.svg" width="150" height="150" alt="{name}">
        <h3>{name}</h3>
        <p>{note}</p>
        <div class="small">
          <img src="{key}-app.svg" width="32" height="32" alt=""><img src="{key}-app.svg" width="16" height="16" alt="">
          <span class="bar light"><img src="{key}-menubar.svg" alt=""></span>
          <span class="bar dark"><img class="inv" src="{key}-menubar.svg" alt=""></span>
        </div>
      </article>""")
        sections_html.append(f"""
  <section>
    <h2>{title} <span>{blurb}</span></h2>
    <div class="row">{''.join(cards)}
    </div>
  </section>""")

    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Otium icon refinement · round 2</title>
<style>
  * {{ box-sizing: border-box; }}
  body {{ margin:0; padding:40px; width:1280px; background:#F7F7F5; color:#1D1D1F;
         font: 14px/1.45 -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; }}
  h1 {{ margin:0 0 4px; font-size:26px; letter-spacing:-0.01em; }}
  .lede {{ margin:0 0 26px; color:#6E6E73; }}
  section {{ margin-bottom:28px; }}
  h2 {{ margin:0 0 12px; font-size:18px; }}
  h2 span {{ font-weight:400; color:#6E6E73; font-size:14px; margin-left:8px; }}
  .row {{ display:grid; grid-template-columns: repeat(5, 1fr); gap:14px; }}
  .card {{ background:#fff; border:1px solid #E7E7E3; border-radius:16px; padding:18px 14px 14px; text-align:center; }}
  .hero {{ display:block; margin:0 auto 8px; filter: drop-shadow(0 8px 14px rgba(0,0,0,0.16)); }}
  h3 {{ margin:0 0 4px; font-size:14px; }}
  p {{ margin:0 0 12px; min-height:56px; color:#6E6E73; font-size:12px; }}
  .small {{ display:flex; align-items:center; justify-content:center; gap:8px; }}
  .bar {{ display:inline-grid; place-items:center; width:30px; height:22px; border-radius:5px; }}
  .bar img {{ width:16px; height:16px; }}
  .bar.light {{ background:#ECECEC; }}
  .bar.dark {{ background:#2A2A2C; }}
  .inv {{ filter: invert(1); }}
</style></head>
<body>
  <h1>Otium · icon refinement, round 2</h1>
  <p class="lede">Five variations each of Orbit and Dusk. Under each: the icon at 32 and 16px, then the one-colour menu bar version on light and dark.</p>
  {''.join(sections_html)}
</body></html>
"""
    with open(os.path.join(HERE, "index.html"), "w") as f:
        f.write(html)
    print("wrote", count, "variations and index.html")


main()
