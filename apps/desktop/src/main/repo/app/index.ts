import * as db from './db.js'
import * as fs from './fs/index.js'

export const exists = async (): Promise<boolean> => {
  return await db.exists()
}

export const initialize = async ({
  workspacePath,
  version,
}: {
  workspacePath: string
  version: string
}): Promise<void> => {
  await fs.create({
    workspacePath,
    version,
  })

  await db.createTable()
}
