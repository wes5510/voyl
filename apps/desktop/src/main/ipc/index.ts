import { ipcMain } from 'electron'
import treeHandlers from './tree.js'
import favoriteHandlers from './favorite.js'

treeHandlers(ipcMain)
favoriteHandlers(ipcMain)
