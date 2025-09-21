import * as db from '../db.js'
import * as schema from './schema.js'
import fs from 'fs-extra'
import { PATH } from './const.js'

export const exists = async (): Promise<boolean> => {
  const ret = await db.connection.select().from(schema.app).limit(1)
  return !!ret[0]
}

export const create = async ({
  workspacePath,
  version,
}: {
  workspacePath: string
  version: string
}): Promise<void> => {
  await fs.writeJson(PATH, {
    version,
    workspacePath,
  })

  await db.connection.insert(schema.app).values({
    version,
    workspacePath,
  })
}
