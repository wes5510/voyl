import { ipcMain } from 'electron'
import treeHandlers from './tree.js'
import favoriteHandlers from './favorite.js'
import registerAppHandlers from './app.js'

registerAppHandlers()
treeHandlers(ipcMain)
favoriteHandlers(ipcMain)
