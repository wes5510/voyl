import { useRootNodeId } from '@/renderer/state/tree'
import { setTreeViewTopNodeId } from '@/renderer/state/treeView'
import { useEffect } from 'react'
import { useParams } from 'react-router'

export default function useSetTreeViewTopNode() {
  const { nodeId } = useParams()
  const rootNodeId = useRootNodeId()

  useEffect(() => {
    setTreeViewTopNodeId({ topNodeId: nodeId ?? rootNodeId })
  }, [nodeId, rootNodeId])
}
