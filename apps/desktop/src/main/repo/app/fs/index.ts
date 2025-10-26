import fse from 'fs-extra'
import { PATH } from './const.js'
// eslint-disable-next-line voyl/same-level-import
import type { App } from '../db/index.js'

async function create({ version, workspaceDirPath }: App): Promise<void> {
  await fse.writeJson(PATH, {
    version,
    workspaceDirPath,
  })
}

async function exists(): Promise<boolean> {
  return await fse.pathExists(PATH)
}

async function read(): Promise<App> {
  return await fse.readJson(PATH)
}

async function getStat(): Promise<fse.Stats | null> {
  try {
    return await fse.stat(PATH)
  } catch {
    return null
  }
}

async function getMtimeMs(): Promise<number | null> {
  const stat = await getStat()
  return stat ? stat.mtimeMs : null
}

const AppFs = {
  create,
  exists,
  read,
  getStat,
  getMtimeMs,
  PATH,
}

export default AppFs
