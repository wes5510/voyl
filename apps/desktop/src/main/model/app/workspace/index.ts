import WorkspaceRepo from '../../../repo/workspace/index.js'

async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  WorkspaceRepo.setPath({ workspaceDirPath })
  await WorkspaceRepo.initialize()
}

async function sync({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  WorkspaceRepo.setPath({ workspaceDirPath })
  await WorkspaceRepo.sync()
}

const WorkspaceModel = {
  initialize,
  sync,
}

export default WorkspaceModel
