# Otium

A calm macOS menu bar app that reminds you to take healthy breaks while you work.

*Otium* (OH-tee-um) is Latin for leisure: time away from work, the counterpart to *negotium*, business.

- **Stand up**: every 45 minutes
- **Water**: every 60 minutes
- **Eye break (20-20-20)**: every 20 minutes. Look at something 20 feet away for 20 seconds.

Each reminder has its own timer with start, pause and reset. When a timer runs out, you get a macOS notification and the timer starts again by itself. If now isn't a good moment, **Snooze 5 min** (in the notification, or on the timer card for 10 minutes after a reminder). You can change the intervals in Settings, and they're saved between launches.

Otium lives only in the menu bar: no dock icon. Click the icon to open the panel, and click anywhere else to close it. Right-click the icon (or use the link at the bottom of the panel) to quit.

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

This creates `release/mac-arm64/Otium.app` (or `release/mac/Otium.app` on Intel Macs). Drag it into Applications to install it.

The app is **unsigned** (not signed with an Apple Developer ID). It runs fine on the Mac that built it. If you send it to someone else, macOS will say it's from an unidentified developer; they can right-click it and choose **Open** the first time.

## Other commands

| Command | What it does |
| --- | --- |
| `npm run typecheck` | Checks the TypeScript for mistakes without building |

## How it's put together

Electron apps have two halves. The **main process** is the engine room: it runs the whole time, even with the panel closed. The **renderer** is the panel you see, a small React web page. They talk only through a narrow, safe bridge (the preload script).

```
src/
├── shared/types.ts        Names and shapes used by both halves (timer ids, copy, message names)
├── main/                  Engine room
│   ├── index.ts           Startup: hides the dock icon, wires everything together
│   ├── timers.ts          The three timers (stores the end time, so sleep doesn't throw it off)
│   ├── notifier.ts        macOS notifications and the Snooze button
│   ├── tray.ts            Menu bar icon and the panel window under it
│   ├── store.ts           Saved settings (electron-store)
│   └── ipc.ts             Answers requests from the panel
├── preload/index.ts       The bridge: exposes window.otium to the panel
└── renderer/              The panel (React)
    └── src/
        ├── App.tsx        Header, timer list or settings, footer
        ├── components/    TimerCard, Settings, Icons
        ├── hooks/         useTimers: live data from the engine
        └── styles.css     Colours (light and dark), type, layout
resources/                 Menu bar icon (template images that macOS colours for you)
build/icon.png             App icon used when packaging
```

Settings are saved to `~/Library/Application Support/Otium/config.json`.

## Ideas for v2

The code already has places for these:

- **Idle detection**: use Electron's `powerMonitor` to call `pauseAll()` / `resumeAll()` in `timers.ts` when you step away.
- **Spotify detection**: check what's playing via `osascript`, for example to hold reminders during calls or focus music. This would go in a new `src/main/integrations/` folder.
- **Full-screen break overlay**: listen to the timer engine's `fired` event (next to the notifier in `main/index.ts`) and show a gentle full-screen window.

## License

[MIT](LICENSE): you are free to use, change and share this code, as long as you keep the copyright notice.
