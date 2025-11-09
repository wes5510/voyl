import NodeRepo, { NewNode } from '../../repo/node/index.js'

async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  NodeRepo.setPath({ workspaceDirPath })
  await NodeRepo.initialize()
}

async function sync({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  NodeRepo.setPath({ workspaceDirPath })
  await NodeRepo.sync()
}

async function addNode(node: NewNode): Promise<void> {
  await NodeRepo.addNode(node)
}

async function getNodeById({ id }: { id: string }) {
  return NodeRepo.getNodeById({ id })
}

const NodeModel = {
  addNode,
  getNodeById,
  initialize,
  sync,
}

export default NodeModel
