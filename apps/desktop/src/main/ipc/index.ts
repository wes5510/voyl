import { ipcMain } from 'electron'
import treeHandlers from './tree.js'
import favoriteHandlers from './favorite.js'
import registerAppHandlers from './app.js'

registerAppHandlers(ipcMain)
treeHandlers(ipcMain)
favoriteHandlers(ipcMain)
