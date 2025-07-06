import { useRootNodeId } from '@/renderer/store/tree'
import useTreeViewStore from '@/renderer/store/treeView'
import { useEffect } from 'react'
import { useParams } from 'react-router'

export default function useSetTreeViewTopNode() {
  const { nodeId } = useParams()
  const rootNodeId = useRootNodeId()
  const setTopNodeId = useTreeViewStore((state) => state.setTopNodeId)

  useEffect(() => {
    setTopNodeId({ topNodeId: nodeId ?? rootNodeId })
  }, [nodeId, rootNodeId, setTopNodeId])
}
