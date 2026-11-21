// Exports Otium's icons from the SVG sources in design/app-icon/.
// Run from the project root:  npm run icons
//
//   build/icon.png                  1024px app icon (electron-builder makes the .icns from it)
//   resources/trayTemplate.png      18px menu bar icon
//   resources/trayTemplate@2x.png   36px menu bar icon for Retina screens
const { app, BrowserWindow } = require('electron')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const jobs = [
  { svg: 'design/app-icon/otium-app.svg', out: 'build/icon.png', size: 1024 },
  { svg: 'design/app-icon/otium-menubar.svg', out: 'resources/trayTemplate.png', size: 18 },
  { svg: 'design/app-icon/otium-menubar.svg', out: 'resources/trayTemplate@2x.png', size: 36 }
]

app.dock?.hide()
app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false })
  await win.loadURL('about:blank')
  for (const job of jobs) {
    // Give the SVG an explicit size so the browser draws it crisply at that size.
    const svg = fs
      .readFileSync(path.join(root, job.svg), 'utf8')
      .replace('<svg ', `<svg width="${job.size}" height="${job.size}" `)
    const base64 = Buffer.from(svg).toString('base64')
    const dataUrl = await win.webContents.executeJavaScript(`(async () => {
      const img = new Image()
      img.src = 'data:image/svg+xml;base64,${base64}'
      await img.decode()
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = ${job.size}
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, ${job.size}, ${job.size})
      return canvas.toDataURL('image/png')
    })()`)
    fs.writeFileSync(path.join(root, job.out), Buffer.from(dataUrl.split(',')[1], 'base64'))
    console.log(`wrote ${job.out} (${job.size}px)`)
  }
  app.quit()
})
