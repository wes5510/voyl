import { BrowserWindow, shell, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import Store from 'electron-store'

interface WindowState {
  x?: number
  y?: number
  width: number
  height: number
  isMaximized: boolean
}

const DEFAULT_WINDOW_STATE: WindowState = {
  width: 900,
  height: 670,
  isMaximized: false,
}

const store = new Store<{ windowState: WindowState }>()

function isPositionOnDisplay(x: number, y: number): boolean {
  return screen.getAllDisplays().some((display) => {
    const { x: dx, y: dy, width, height } = display.bounds
    return x >= dx && x < dx + width && y >= dy && y < dy + height
  })
}

function getValidatedWindowState(): WindowState {
  const savedState = store.get('windowState', DEFAULT_WINDOW_STATE)

  // Reset position if display configuration changed
  if (
    savedState.x !== undefined &&
    savedState.y !== undefined &&
    !isPositionOnDisplay(savedState.x, savedState.y)
  ) {
    return { ...savedState, x: undefined, y: undefined }
  }

  return savedState
}

function setupWindowStateTracking(window: BrowserWindow): void {
  const saveState = (): void => {
    const bounds = window.getBounds()
    store.set('windowState', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isMaximized: window.isMaximized(),
    })
  }

  window.on('resize', saveState)
  window.on('move', saveState)
  window.on('maximize', saveState)
  window.on('unmaximize', saveState)
}

function loadWindowContent(window: BrowserWindow): void {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

export function createWindow(): BrowserWindow {
  const { x, y, width, height, isMaximized } = getValidatedWindowState()

  const mainWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  })

  setupWindowStateTracking(mainWindow)

  mainWindow.on('ready-to-show', () => {
    if (isMaximized) {
      mainWindow.maximize()
    }
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  loadWindowContent(mainWindow)

  return mainWindow
}
