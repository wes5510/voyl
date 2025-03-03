import { useParams } from 'react-router'
import useTreeViewStore from '@/models/treeView/store'
import { useEffect } from 'react'
import useTreeStore, { getNodeTable, getRootNodeId } from '@/models/tree/store'

export default function useTreeView(): void {
  const { nodeId } = useParams()
  const setRootNodeId = useTreeViewStore((state) => state.setRootNodeId)
  const { nodeTable, rootNodeId } = useTreeStore((state) => ({
    nodeTable: getNodeTable(state.entity),
    rootNodeId: getRootNodeId(state.entity),
  }))

  useEffect(() => {
    setRootNodeId({ rootNodeId: nodeId ?? rootNodeId, nodeTable })
  }, [nodeId, setRootNodeId, rootNodeId, nodeTable])
}
