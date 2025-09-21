import { app } from 'electron'
import path from 'path'

const FILE_NAME = 'config.json'
export const PATH = path.join(app.getPath('userData'), FILE_NAME)
