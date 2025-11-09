import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import './ipc/index.js'
import { createWindow } from './window/index.js'

async function installDevTools(): Promise<void> {
  if (!is.dev) {
    return
  }

  try {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = await import(
      'electron-devtools-installer'
    )

    // @ts-expect-error electron-devtools-installer is not typed
    const extensionName = await installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    })

    console.log(`Added Extension: ${extensionName}`)
  } catch (err) {
    console.error('Failed to install React DevTools:', err)
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  await installDevTools()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
