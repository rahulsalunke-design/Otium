# Otium

A calm macOS menu bar app that reminds you to take healthy breaks while you work.

*Otium* (OH-tee-um) is Latin for leisure: time away from work, the counterpart to *negotium*, business.

It comes with three built-in reminders:

- **Stand up**: every 45 minutes
- **Water**: every 60 minutes
- **Eye break (20-20-20)**: every 20 minutes. Look at something 20 feet away for 20 seconds.

Click **✎ Edit reminders** in the panel's header to switch any of them off, change how often each one comes up, and **add your own** (for example "Stretch" every 30 minutes or "Take a walk" every 90), up to 10 reminders in total. Your own reminders can be renamed or deleted; the built-in ones can only be switched off. Each reminder is one compact line; click it to open its details (name, interval with − / +, sound, icon, delete) right there. Every change applies straight away, like macOS System Settings; switching a reminder off or deleting one shows a short **Undo**. Each reminder also has a **Start when Otium opens** checkbox (ticked by default). Otium opens when you log in, so untick it for a reminder you only want sometimes: it waits in your list, showing ▶ with its full time, until you press start. Reminders you add or switch on while using Otium start straight away. Everything is saved between launches.

Each reminder has an **icon** too: the built-in ones start with a standing person, a glass of water and an eye, and you can pick any of 21 icons (walk, breathe, coffee, medicine and more) for any reminder in Edit reminders.

Each reminder also has its own **sound**, picked from four calm sounds made for Otium (**Chime**, **Droplet**, **Rise** and **Bowl**) or **None** for silence. Choosing a sound plays it, and the ▶ button plays it again. By default, Stand up uses Rise, Water uses Droplet, Eye break uses Bowl, and your own reminders use Chime. For now, sounds play even when a macOS Focus mode is on.

The panel has two views, switched with the buttons at the top:

- **List**: one compact row per reminder: a small ring gauge with its icon, the name, the exact countdown and pause/play. Every row has **↺ Reset** beside pause/play. Hover a row to see how often it repeats and a **Snooze 5 min** link; after a reminder goes off, its row stays open so Snooze is right there. A row glows briefly when its reminder goes off.
- **Glance**: a compact grid of rings, one per reminder. Each ring empties like a clock as the time runs down, with its icon in the middle and the time left in minutes. Hover over a ring to pause or start it.

Otium remembers which view you used last.

**Appearance** (the palette button in the header) changes the look straight away:

- **Theme**: Sage (default), Dusk, Dawn, Travertine, Tide or Graphite. Each has a light and a dark version and follows your Mac's appearance.
- **Follow day**: Dawn until 11:00, Sage until 17:00, then Dusk.
- **Glass background**: a frosted, see-through panel using macOS's own blur.

Each switched-on reminder has its own timer with start, pause and reset. When a timer runs out, you get a macOS notification and the timer starts again by itself. If now isn't a good moment, **Snooze 5 min** (in the notification, or on the timer card for 10 minutes after a reminder).

Otium lives only in the menu bar: no dock icon. Click the icon to open the panel, and click anywhere else to close it. To quit, click the power button at the top right of the panel, or right-click the menu bar icon. Right-click the icon also has **Open at Login** (on by default), so Otium starts whenever you log in to your Mac.

## Requirements

- macOS (Apple Silicon or Intel)
- [Node.js](https://nodejs.org) 22.12 or newer (LTS recommended)

## Run it while developing

```bash
npm install
npm run dev
```

The Otium icon appears in your menu bar. Changes to the panel (anything in `src/renderer`) show up instantly. Changes to the engine room (`src/main`, `src/preload`) need a restart: press `Ctrl+C` in the terminal and run `npm run dev` again.

While developing, notifications show as coming from "Electron". The first time, macOS asks whether to allow them. If you miss that prompt, go to **System Settings → Notifications → Electron**.

## Build the app

```bash
npm run build
```

This creates `release/mac-arm64/Otium.app` (or `release/mac/Otium.app` on Intel Macs). Drag it into Applications to install it. Open at Login only works for the copy in Applications (the build folder is replaced on every build).

The app is **unsigned** (not signed with an Apple Developer ID). It runs fine on the Mac that built it. If you send it to someone else, macOS will say it's from an unidentified developer; they can right-click it and choose **Open** the first time.

## Other commands

| Command | What it does |
| --- | --- |
| `npm run typecheck` | Checks the TypeScript for mistakes without building |
| `npm run icons` | Re-exports the app icon and menu bar icon from the SVGs in `design/app-icon/` |

## How it's put together

Electron apps have two halves. The **main process** is the engine room: it runs the whole time, even with the panel closed. The **renderer** is the panel you see, a small React web page. They talk only through a narrow, safe bridge (the preload script).

```
src/
├── shared/types.ts        Names and shapes used by both halves (reminders, built-in copy, limits)
├── main/                  Engine room
│   ├── index.ts           Startup: hides the dock icon, wires everything together
│   ├── timers.ts          One timer per switched-on reminder (stores the end time, so sleep doesn't throw it off)
│   ├── notifier.ts        macOS notifications and the Snooze button
│   ├── sounds.ts          Plays reminder sounds with macOS's built-in afplay
│   ├── tray.ts            Menu bar icon and the panel window under it
│   ├── store.ts           Saved reminders (electron-store), checked and cleaned on every save
│   └── ipc.ts             Answers requests from the panel
├── preload/index.ts       The bridge: exposes window.otium to the panel
└── renderer/              The panel (React)
    └── src/
        ├── App.tsx        Header and the three screens: timers, Edit reminders, Appearance
        ├── components/    ListView, GlanceView, ReminderEditor, AppearanceSection, ReminderIcon, Icons
        ├── lib/time.ts    Countdown and minutes formatting shared by both views
        ├── hooks/         useTimers: live data from the engine
        ├── styles.css     Colours (light and dark), type, layout
        └── themes.css     The other colour themes, plus the Glass background
resources/                 Menu bar icon (template images that macOS colours for you) and sounds/
design/app-icon/           Source SVGs for the app icon and the simplified menu bar icon
design/icon-concepts/      Icon exploration: round 1 (six concepts) and round 2 (Orbit and Dusk variations)
design/list-concepts/      List view exploration: layout sheets and the interactive prototype (prototype.html)
design/theme-concepts/     Theme exploration: palettes (themes.mjs), real-panel screenshots and the comparison sheet
scripts/make-sounds.py     Creates the four reminder sounds (original, MIT licensed): python3 scripts/make-sounds.py
build/icon.png             App icon used when packaging
```

Reminders and appearance are saved to `~/Library/Application Support/Otium/config.json`.

## Ideas for v2

The code already has places for these:

- **Idle detection**: use Electron's `powerMonitor` to call `pauseAll()` / `resumeAll()` in `timers.ts` when you step away.
- **Spotify detection**: check what's playing via `osascript`, for example to hold reminders during calls or focus music. This would go in a new `src/main/integrations/` folder.
- **Full-screen break overlay**: listen to the timer engine's `fired` event (next to the notifier in `main/index.ts`) and show a gentle full-screen window.

## License

[MIT](LICENSE): you are free to use, change and share this code, as long as you keep the copyright notice.
