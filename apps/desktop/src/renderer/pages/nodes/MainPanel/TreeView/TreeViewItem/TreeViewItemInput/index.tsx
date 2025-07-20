import { useHotkeys } from 'react-hotkeys-hook'
import { ChangeEvent, useRef, useState } from 'react'
import mergeRefs from 'merge-refs'
import { useTreeNode } from '@/renderer/store/tree'
import useAutoResize from './useAutoResize'
import useHandlePaste from './useHandlePaste'
import useHandleKey from './useHandleKey'
import useFocus from './useFocus'
import cn from '@/renderer/common/shared/cn'

export interface TreeViewItemInputProps {
  nodeId: string
  className?: string
}

export default function TreeViewItemInput({ nodeId, className }: TreeViewItemInputProps) {
  const elemRef = useRef<HTMLTextAreaElement>(null)
  const node = useTreeNode({ nodeId })
  const [localTitle, setLocalTitle] = useState(node?.title || '')

  // node 데이터가 변경되면 localTitle 동기화
  if (node?.title !== undefined && localTitle !== node.title) {
    setLocalTitle(node.title)
  }

  const keyRef = useHotkeys<HTMLTextAreaElement>(
    ['enter', 'backspace', 'up', 'down', 'tab', 'shift+tab'],
    useHandleKey({ nodeId }),
    {
      enableOnFormTags: ['textarea'],
      preventDefault: (_e, hotKeyEvent) => {
        const keys = hotKeyEvent.keys?.join('')
        return keys === 'enter' || keys === 'up'
      },
    },
  )

  useAutoResize({ ref: elemRef })
  const handleFocus = useFocus({ nodeId, ref: elemRef })
  const handlePaste = useHandlePaste({ nodeId })

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setLocalTitle(e.target.value)
    // TODO: 실제 백엔드 업데이트는 debounce 또는 blur 시점에 처리
  }

  const handleBlur = (): void => {
    // TODO: 실제 백엔드 업데이트 로직 구현
    // 현재는 로컬 상태만 관리
  }

  return (
    <textarea
      ref={mergeRefs(keyRef, elemRef)}
      value={localTitle}
      onChange={handleChange}
      onBlur={handleBlur}
      onPaste={handlePaste}
      rows={1}
      onFocus={handleFocus}
      className={cn('word-break-break-word resize-none outline-none', className)}
    />
  )
}
