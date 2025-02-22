import { NodeEntity } from './node'

export interface TreeEntity {
  nodes: NodeEntity[]
}

export const insertNewAfter = ({
  entity,
  refNodeId,
  newNodeTitle,
}: {
  entity: TreeEntity
  refNodeId: string
  newNodeTitle: string
}): TreeEntity => {
  /*
  - A 노드 접혀있는지 확인
	- A 노드가 접혀있다면
		- A 노드의 다음 형제 노드로 새로운 노드 추가
			- A 노드의 parent node id, index 가져오기
			- 새로운 노드의 index 생성
			- parent node id와 index로 새로운 노드 생성
				- 새로운 Task 생성
	- A 노드가 펼쳐있다면
		- A 노드의 첫번째 자식으로 새로운 노드 추가
			- A노드 id 가져오기
			- 새로운 노드의 index 생성
			- parent node id 와 index로 새로운 노드 생성
				- 새로운 Task 생성
  */
  return entity
}

export const removeNode = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): TreeEntity => {
  return {
    nodes: entity.nodes.filter((node) => node.id !== nodeId),
  }
}
