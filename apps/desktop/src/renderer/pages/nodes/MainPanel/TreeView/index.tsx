import { memo } from 'react'
import TreeViewItem from './TreeViewItem'

const MemoizedTreeViewItem = memo(TreeViewItem)

const useFlattenedTree = () => {
  /*
  1. topNodeId 가져오기
  2. nodeTable 만들기
    2-1. node 모으기
      2-1-1. isTop 이거나 expanded 이면 
        2-1-1-1. node에 해당하는 child 가져오기
        2-1-1-2. nodeTable에 추가
        2-1-1-3. 2-1. 반복
  3. initFlattenedTree 호출
  4. initFlattenedTree 결과 반환
  */
}

export default function TreeView() {
  const flattenedTree = useFlattenedTree()

  return (
    <div className="items-normal flex flex-col gap-3">
      {flattenedTree.map((node) => (
        <MemoizedTreeViewItem key={node.id} nodeId={node.id} depth={node.depth} />
      ))}
    </div>
  )
}
