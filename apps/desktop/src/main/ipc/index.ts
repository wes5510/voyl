import { ipcMain } from 'electron'
import appHandlers from './app.js'
import treeHandlers from './tree.js'
import favoriteHandlers from './favorite.js'

appHandlers(ipcMain)
treeHandlers(ipcMain)
favoriteHandlers(ipcMain)
