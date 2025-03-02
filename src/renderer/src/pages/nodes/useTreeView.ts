import { useParams } from 'react-router'
import useTreeViewStore from '@/models/treeView/store'
import { useEffect } from 'react'
import useTreeStore, { getNodeTable } from '@/models/tree/store'

export default function useTreeView(): void {
  const { nodeId } = useParams()
  const setRootNodeId = useTreeViewStore((state) => state.setRootNodeId)
  const nodeTable = useTreeStore((state) => getNodeTable(state.entity))

  useEffect(() => {
    if (nodeId) {
      setRootNodeId({ rootNodeId: nodeId, nodeTable })
    }
  }, [nodeId, setRootNodeId, nodeTable])
}
