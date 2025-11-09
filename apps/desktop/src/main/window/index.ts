import { BrowserWindow, screen, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

function getExternalDisplayPosition(): { x: number; y: number } | undefined {
  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find(
    (display) => display.bounds.x !== 0 || display.bounds.y !== 0,
  )

  if (!externalDisplay) {
    return undefined
  }

  return {
    x: externalDisplay.bounds.x + 50,
    y: externalDisplay.bounds.y + 50,
  }
}

export function createWindow(): BrowserWindow {
  const position = getExternalDisplayPosition()

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    ...position,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
