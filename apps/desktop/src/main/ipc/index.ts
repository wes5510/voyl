import { ipcMain } from 'electron'
import nodesHandlers from './nodes.js'

nodesHandlers(ipcMain)
