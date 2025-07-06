import { ipcMain } from 'electron'
import treeHandlers from './tree.js'
import favoriteHandlers from './favorite.js'
import nodesHandlers from './nodes.js'

treeHandlers(ipcMain)
favoriteHandlers(ipcMain)
nodesHandlers(ipcMain)
