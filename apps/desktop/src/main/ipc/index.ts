import { ipcMain } from 'electron'
import nodesHandlers from './nodes.js'
import favoriteHandlers from './favorite.js'

nodesHandlers(ipcMain)
favoriteHandlers(ipcMain)
