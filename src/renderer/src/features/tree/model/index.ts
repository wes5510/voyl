/* 다음 친구 노드에 노드 추가
const addNextSiblingNode = ({
  entity,
  newNode,
}: {
  entity: NodeEntity
  newNode: NodeEntity
}): NodeEntity => {
  // A <-> B
  // A 다음으로 C 추가
  // A의 다음 sibling 노드가 C
  // B의 이전 sibling 노드가 C
  // 부모 노드의 childIds 에 C 추가
  // C의 parentNode 는 부모 노드
  // C의 prevSiblingNodeId 는 A
  // C의 nextSiblingNodeId 는 B
  // 부모 노드 가져오기
  // 
}
*/
