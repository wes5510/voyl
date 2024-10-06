import { HotkeyCallback } from 'react-hotkeys-hook'
import useCreateNewNode from './useCreateNewNode'
import { getDepthBySourceNode } from './model'
import { useAtomValue, useSetAtom } from 'jotai'
import { collapsedAtom, depthAtom, textAtom } from './store'
import { focusedNodeIdAtom, insertAfterTreeAtom } from '../store'
import { useCallback } from 'react'

interface Selection {
  start: number
  end: number
}

const getSourceNodeText = ({
  text,
  selectionStart
}: {
  text: string
  selectionStart?: Selection['start']
}): string => (selectionStart === undefined ? text : text.slice(0, selectionStart))

const getNewNodeText = ({
  text,
  selectionEnd
}: {
  text: string
  selectionEnd?: Selection['end']
}): string => (selectionEnd ? text.slice(selectionEnd) : '')

export default function useHandleEnterInNode({ nodeId }: { nodeId: string }): HotkeyCallback {
  const collapsed = useAtomValue(collapsedAtom(nodeId))
  const depth = useAtomValue(depthAtom(nodeId))
  const setText = useSetAtom(textAtom(nodeId))
  const setFocusedNodeId = useSetAtom(focusedNodeIdAtom)
  const createNewNode = useCreateNewNode()
  const insertAfter = useSetAtom(insertAfterTreeAtom)

  return useCallback(
    (e: KeyboardEvent) => {
      const { value, selectionStart, selectionEnd } = e.target as HTMLTextAreaElement

      setText(
        getSourceNodeText({
          text: value,
          selectionStart
        })
      )

      const newNode = createNewNode({
        text: getNewNodeText({
          text: value,
          selectionEnd
        }),
        depth: getDepthBySourceNode({
          collapsed,
          depth
        })
      })

      insertAfter({ sourceNodeId: nodeId, targetNodeId: newNode.id })
      setFocusedNodeId(newNode.id)
    },
    [collapsed, createNewNode, depth, insertAfter, nodeId, setFocusedNodeId, setText]
  )
}
