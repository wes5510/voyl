import * as db from './db/index.js'

export const initialize = async (): Promise<void> => {
  await db.createTable()
}
