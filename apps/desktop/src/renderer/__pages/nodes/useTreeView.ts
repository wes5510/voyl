import { useParams } from 'react-router'
import useTreeViewStore from '@/renderer/models/treeView/store'
import { useEffect } from 'react'
import useTreeStore, { getNodeTable, getRootNodeId } from '@/renderer/models/tree/store'

export default function useTreeView(): void {
  const { nodeId } = useParams()
  const setRootNodeId = useTreeViewStore((state) => state.setRootNodeId)
  const { nodeTable, rootNodeId } = useTreeStore((state) => ({
    nodeTable: getNodeTable({ entity: state.entity }),
    rootNodeId: getRootNodeId({ entity: state.entity }),
  }))

  useEffect(() => {
    setRootNodeId({ rootNodeId: nodeId ?? rootNodeId, nodeTable })
  }, [nodeId, setRootNodeId, rootNodeId, nodeTable])
}
