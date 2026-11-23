# Otium: version screenshots

Screenshots of every version of the app, for the case study. Each version was rebuilt from its saved state in Git and captured the same way:

- **3× pixel density**: 960px wide for the 320px panel. Sharp in Figma, slides or a portfolio site.
- **Light and dark** for every screen (`-light.png` / `-dark.png`).
- **Same demo data and moment** in every version: about 21 minutes into a session, with **Eye break having just gone off** (so its Snooze button shows). The demo uses two custom reminders where they exist: *Stretch* (on, 30 min) and *Take a walk* (off, 90 min).
- **The panel only.** The menu bar icon and macOS notifications aren't included; take those with Cmd + Shift + 5.

The "Next at" times shown aren't the real time of day, because the demo clock was moved forward.

This folder is listed in `.gitignore`, so it stays on this Mac and isn't uploaded to GitHub.

## Versions

| # | Folder | Version | Saved | What changed |
|---|---|---|---|---|
| 1 | `01-pause-v1` | First build, called **Pause** | 21 Nov 2026, commit `97a9f6b` | Three fixed timers (Stand up 45, Water 60, Eye break 20) with start/pause/reset, live countdown, notifications, Snooze, and a Settings screen for the three intervals. |
| 2 | `02-renamed-otium` | Renamed to **Otium** | 21 Nov 2026, commit `e3b60a3` | New name (Latin for leisure) in the panel, menus and app. Otherwise the same as v1. |
| 3 | `03-custom-reminders` | **Custom reminders** | 21 Nov 2026, commit `08fd096` | On/off switch for each built-in reminder; add, rename and delete your own (up to 10); "All reminders are off" state; the list scrolls when it's long. |
| 4 | `04-reminder-sounds` | **Reminder sounds** | 21 Nov 2026, commit `2e887b4` | A sound for each reminder (Chime, Droplet, Rise, Bowl or None), previewed as you pick. |
| 5 | `05-quit-in-header` | **Quit in the header** | 21 Nov 2026, commit `3c37200` | Quit moved from a footer link to a power icon beside Settings; the footer is gone. |
| 6 | `06-icons-and-glance-view` | **Icons and Glance view** | 21 Nov 2026, commit `3c37200` | An icon for every reminder (21 to choose from), icons in List cards, and a new **Glance** view: a grid of rings that empty like a clock, with minutes only. A List/Glance switch in the header. |
| 7 | `07-compact-list-view` | **Compact List view** | 21 Nov 2026, commits `06857cb` (icon) and `87d238b` (list) | The card list became compact rows (a hybrid of explored layouts B4 and D4): ring gauge with the icon, name, countdown and pause. Hover reveals "every N min" and Snooze; the ring turns into Reset. About 55% shorter. New app icon (Orbit × Dusk). |
| 8 | `08-themes` | **Themes** | 21 Nov 2026, commit `b819434` | Appearance section in Settings: six colour themes (Sage, Dusk, Dawn, Travertine, Tide, Graphite), Follow the day and a Glass background, all with live preview. `5-theme-*` shows each theme; `6-glass-simulated` shows Glass (simulated, since macOS's real blur can't be captured). A Serif typeface was built, then removed. |
| 9 | `09-split-editing` | **Split editing** | 21 Nov 2026, commit `b819434` | Settings split in two (option 3 of the Settings exploration): ✎ Edit reminders turns the list into compact editable lines that open in place (interval −/+, sound, icon, delete; Cancel / Done), and the palette button opens a short Appearance screen that saves instantly. Replaces the single long Settings form. |
| 10 | `10-reset-button` | **Reset button** | 23 Nov 2026, commit `cf40f40` | ↺ Reset is back beside pause/play on every row (it had been hidden behind hovering the ring). Snooze moved to the row's second line ("every 20 min · Snooze 5 min") so names never get cut off; a row stays open after its reminder goes off. List-view shots only (`1-timers`, `1a-list-hover` with Water hovered). |
| 11 | `11-instant-editing` | **Instant editing** | 23 Nov 2026, commit `ca7dba0` | Edit reminders drops Cancel / Done: the switch, interval, sound, icon, name, add and delete all apply straight away (option G of the on/off exploration), with a 4-second Undo after switching off or deleting. Half-typed entries keep their last valid value. Shots: `2b-edit-reminder-open`, `2d-edit-undo`. |

## Screens in each folder

| File | Screen | Versions |
|---|---|---|
| `1-timers` | Main panel with live timers; Eye break showing Snooze | All |
| `1a-list-hover` / `1a-list-ring-hover` | List row expanded on hover (interval + Snooze); ring turned into Reset | 7–9 |
| `1b-glance` | Glance view: rings with icons, minutes left; Eye break showing Snooze | 6–9 |
| `2-settings` | Settings | 1–8 |
| `2-edit-reminders` / `2b-edit-reminder-open` / `2c-appearance` | Edit reminders (closed / Stretch open) and the Appearance screen | 9 |
| `2b-settings-icon-picker` | Settings with the icon picker open for Stretch | 6–9 |
| `3-settings-invalid-value` | Settings with an invalid interval (0) flagged and Save disabled | 1–2 |
| `3-settings-adding-reminder` | Settings right after "+ Add reminder": empty name field flagged | 3–8 |
| `3-edit-adding-reminder` | Edit reminders right after "+ Add reminder": new line open, name field focused | 9 |
| `4-all-reminders-off` | Main panel when every reminder is switched off | 3–9 |

## Story at a glance

- **v1 → v2:** naming. A generic word became a name with a story.
- **v2 → v3:** from a fixed tool to a personal one. People choose what they're reminded about.
- **v3 → v4:** each reminder gets its own voice, so you can tell them apart without looking.
- **v4 → v5:** a quieter layout, with app-level actions grouped together in the header.
- **v5 → v6:** from reading to glancing. Icons make each reminder recognisable at a glance, and the Glance view swaps exact seconds for a ring that shows progress like a clock.
- **v6 → v7:** less chrome, same control. Each reminder shrinks to one calm row; details and actions appear only when you reach for them (progressive disclosure).
- **v7 → v8:** the product starts to feel personal. Six palettes, a theme that follows the day (echoing the icon) and Glass, all previewed live before you commit.
- **v8 → v9:** settings that don't grow with you. Editing moves to where the reminders are, and the look gets its own small screen; one long form becomes two short, focused ones.
- **v9 → v10:** a step back toward the obvious. Hiding Reset behind a hover made the main action hard to find, so it returns as a visible button, and Snooze moves down a line to make room.
- **v10 → v11:** let the control mean what it looks like. A switch that waits for Done is a small lie; now it acts immediately, and Undo replaces Cancel as the safety net.
