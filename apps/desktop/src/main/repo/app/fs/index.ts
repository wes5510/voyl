import fse from 'fs-extra'
import { PATH as _PATH } from './const.js'
import { App } from '../type.js'

export const PATH = _PATH

export const create = async ({
  version,
  workspacePath,
}: App): Promise<void> => {
  await fse.writeJson(PATH, {
    version,
    workspacePath,
  })
}

export const exists = async (): Promise<boolean> => {
  return await fse.pathExists(PATH)
}

export const read = async (): Promise<App> => {
  return await fse.readJson(PATH)
}

export const getStat = async (): Promise<fse.Stats | null> => {
  try {
    return await fse.stat(PATH)
  } catch {
    return null
  }
}

export const getMtimeMs = async (): Promise<number | null> => {
  const stat = await getStat()
  return stat ? stat.mtimeMs : null
}
