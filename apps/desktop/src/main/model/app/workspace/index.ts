import * as WorkspaceRepo from '../../../repo/workspace/index.js'

export async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  WorkspaceRepo.setPath({ workspaceDirPath })
  await WorkspaceRepo.initialize()
}

export async function sync({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  WorkspaceRepo.setPath({ workspaceDirPath })
  await WorkspaceRepo.sync()
}
