import { useRootNodeId } from '@/renderer/store/tree'
import { setTreeViewTopNodeId } from '@/renderer/store/treeView'
import { useEffect } from 'react'
import { useParams } from 'react-router'

export default function useSetTreeViewTopNode() {
  const { nodeId } = useParams()
  const rootNodeId = useRootNodeId()

  useEffect(() => {
    setTreeViewTopNodeId({ topNodeId: nodeId ?? rootNodeId })
  }, [nodeId, rootNodeId])
}
