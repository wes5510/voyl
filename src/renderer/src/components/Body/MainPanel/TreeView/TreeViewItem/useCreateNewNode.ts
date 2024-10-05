import { useCallback } from 'react'
import { createNewNode, NodeModel } from './model'
import { nodeAtom } from './store'

export default function useCreateNewNode(): (args: { text: string; depth: number }) => NodeModel {
  return useCallback(({ text, depth }: { text: string; depth: number }) => {
    const __new = createNewNode({
      depth,
      text
    })
    nodeAtom(__new)

    return __new
  }, [])
}
