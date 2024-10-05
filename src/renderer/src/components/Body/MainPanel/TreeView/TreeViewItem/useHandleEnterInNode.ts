import { HotkeyCallback } from 'react-hotkeys-hook'
import useCreateNewNode from './useCreateNewNode'
import { getDepthBySourceNode } from './model'
import { useAtom, useSetAtom } from 'jotai'
import { textAtom } from './store'
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
  const [text, setText] = useAtom(textAtom(nodeId))
  const setFocusedNodeId = useSetAtom(focusedNodeIdAtom)
  const createNewNode = useCreateNewNode()
  const insertAfter = useSetAtom(insertAfterTreeAtom)

  const getSelection = useCallback((): Selection | undefined => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount <= 0) {
      return undefined
    }

    const range = selection.getRangeAt(0)
    return {
      start: range.startOffset,
      end: range.endOffset
    }
  }, [])

  return useCallback(() => {
    const selection = getSelection()
    setText(
      getSourceNodeText({
        text,
        selectionStart: selection?.start
      })
    )

    const newNode = createNewNode({
      text: getNewNodeText({
        text,
        selectionEnd: selection?.end
      }),
      depth: getDepthBySourceNode({
        collapsed: false,
        depth: 0
      })
    })

    insertAfter({ sourceNodeId: nodeId, targetNodeId: newNode.id })
    setFocusedNodeId(newNode.id)
  }, [createNewNode, getSelection, insertAfter, nodeId, setFocusedNodeId, setText, text])
}
