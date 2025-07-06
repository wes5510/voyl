import { useTopNodeId } from '@/renderer/store/treeView'
import NodeHeader from './NodeHeader'
import RootHeader from './RootHeader'
import { useIsRootNodeId } from '@/renderer/store/tree'

export default function Header() {
  const topNodeId = useTopNodeId()
  const isRoot = useIsRootNodeId({ nodeId: topNodeId })

  return <div className="flex items-center gap-3">{isRoot ? <RootHeader /> : <NodeHeader />}</div>
}
