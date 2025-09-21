import fs from 'fs-extra'
import { PATH } from './const.js'

export const create = async ({
  version,
  workspacePath,
}: {
  version: string
  workspacePath: string
}): Promise<void> => {
  await fs.writeJson(PATH, {
    version,
    workspacePath,
  })
}
