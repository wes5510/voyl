import * as _db from '../../shared/db.js'

export const createTable = async (): Promise<void> => {
  await _db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS workspace (
      node_types TEXT NOT NULL DEFAULT '[]',
      attributes TEXT NOT NULL DEFAULT '[]'
    )
  `)
}
