import { useParams } from 'react-router'
import useTreeViewStore from '@/models/treeView/store'
import { useEffect } from 'react'

export default function useTreeView(): void {
  const { nodeId } = useParams()
  const setRootNodeId = useTreeViewStore((state) => state.setRootNodeId)

  useEffect(() => {
    if (nodeId) {
      setRootNodeId(nodeId)
    }
  }, [nodeId, setRootNodeId])
}
