import { dialog, BrowserWindow } from 'electron'
import { homedir } from 'os'
import { join } from 'path'
import * as AppModel from '../model/app/index.js'

export const appHandlers = {
  'app.isInitialized': async (): Promise<boolean> => {
    try {
      return await AppModel.isInitialized()
    } catch (error) {
      console.error('Failed to check initialization status:', error)
      return false
    }
  },

  'app.selectWorkspaceDirPath': async (): Promise<string | null> => {
    const window = BrowserWindow.getFocusedWindow()

    const result = await dialog.showOpenDialog(window!, {
      properties: ['openDirectory', 'createDirectory'],
      title: 'Select Workspace Location',
      buttonLabel: 'Select',
      defaultPath: join(homedir(), 'Documents'),
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  },

  'app.initialize': async (workspaceDirPath: string): Promise<void> => {
    try {
      await AppModel.initializeApp({ workspaceDirPath })
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error
      }

      throw new Error('Failed to initialize app')
    }
  },

  'app.sync': async (): Promise<void> => {
    try {
      await AppModel.sync()
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to sync app')
    }
  },
}
