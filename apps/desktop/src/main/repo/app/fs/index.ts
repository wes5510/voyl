import fse from 'fs-extra'
import { PATH } from './const.js'
import type { App } from '../db/index.js'

export { PATH }

export async function create({ version, workspaceDirPath }: App): Promise<void> {
  await fse.writeJson(PATH, {
    version,
    workspaceDirPath,
  })
}

export async function exists(): Promise<boolean> {
  return await fse.pathExists(PATH)
}

export async function read(): Promise<App> {
  return await fse.readJson(PATH)
}

export async function getStat(): Promise<fse.Stats | null> {
  try {
    return await fse.stat(PATH)
  } catch {
    return null
  }
}

export async function getMtimeMs(): Promise<number | null> {
  const stat = await getStat()
  return stat ? stat.mtimeMs : null
}
