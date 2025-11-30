import { useTopNodeId } from '@/renderer/state/treeView'
import NodeHeader from './NodeHeader'
import RootHeader from './RootHeader'
import { useIsRootNodeId } from '@/renderer/state/tree'

export default function Header() {
  const topNodeId = useTopNodeId()
  const isRoot = useIsRootNodeId({ nodeId: topNodeId })

  return <div className="flex items-center gap-3">{isRoot ? <RootHeader /> : <NodeHeader />}</div>
}
