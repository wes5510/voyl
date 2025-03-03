import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  indentNode,
  insertNewNodeAfter,
  outdentNode,
  removeNodeByNodeId,
  TreeEntity,
} from './index'
import { getNode } from './nodeTable'
import { getTaskTitle, getParentNodeId, getChildNodeIds, NodeEntity } from './node'
import * as uuid from 'uuid'

vi.mock('uuid', () => {
  const v4 = vi.fn()
  return { v4 }
})

describe('removeNodeByNodeId', () => {
  it('루트 노드를 삭제하면 에러 발생', () => {
    const entity: TreeEntity = {
      rootNodeId: 'n-1',
      nodeTable: new Map([
        [
          'n-1',
          {
            id: 'n-1',
            childNodeIds: [],
            parentNode: undefined,
            task: {
              id: 't-1',
              title: 't-1',
              done: false,
            },
          },
        ],
      ]),
    }

    expect(() => removeNodeByNodeId({ entity, nodeId: 'n-1' })).toThrow()
  })

  it('삭제할 노드가 없을때, 노드를 삭제하면 이전 엔티티 그대로 반환한다', () => {
    const entity: TreeEntity = {
      rootNodeId: 'n-1',
      nodeTable: new Map([
        [
          'n-1',
          {
            id: 'n-1',
            childNodeIds: [],
            parentNodeId: undefined,
            task: {
              id: 't-1',
              title: 't-1',
              done: false,
            },
          },
        ],
      ]),
    }

    const newEntity = removeNodeByNodeId({ entity, nodeId: 'n-2' })
    expect(newEntity).toEqual(entity)
  })

  it('삭제할 노드가 있을때, 노드를 삭제하면 노드가 삭제된 엔티티를 반환한다', () => {
    const deletedNodes: NodeEntity[] = [
      {
        id: 'n-1-1',
        childNodeIds: ['n-1-1-1'],
        parentNodeId: 'n-1',
        task: {
          id: 't-1-1',
          title: 't-1-1',
          done: false,
        },
      },
      {
        id: 'n-1-1-1',
        childNodeIds: [],
        parentNodeId: 'n-1-1',
        task: {
          id: 't-1-1-1',
          title: 't-1-1-1',
          done: false,
        },
      },
    ]

    const rootNode: NodeEntity = {
      id: 'n-1',
      childNodeIds: ['n-1-1', 'n-1-2'],
      parentNodeId: undefined,
      task: {
        id: 't-1',
        title: 't-1',
        done: false,
      },
    }

    const nodeTable = new Map([
      [rootNode.id, rootNode],
      [deletedNodes[0].id, deletedNodes[0]],
      [deletedNodes[1].id, deletedNodes[1]],
      [
        'n-1-2',
        {
          id: 'n-1-2',
          childNodeIds: [],
          parentNodeId: 'n-1',
          task: {
            id: 't-1-2',
            title: 't-1-2',
            done: false,
          },
        },
      ],
    ])

    const entity: TreeEntity = {
      rootNodeId: 'n-1',
      nodeTable,
    }

    const newEntity = removeNodeByNodeId({ entity, nodeId: 'n-1-1' })
    expect(newEntity.nodeTable).toEqual(
      new Map(
        Array.from(nodeTable.entries()).filter(
          ([key]) => !deletedNodes.some((node) => node.id === key),
        ),
      ).set(rootNode.id, {
        ...rootNode,
        childNodeIds: ['n-1-2'],
      }),
    )
  })
})

describe('insertNewNodeAfter', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('소스 노드가 없으면 에러 발생', () => {
    expect(() =>
      insertNewNodeAfter({
        entity: {
          nodeTable: new Map(),
          rootNodeId: 'n-1',
        },
        sourceNode: { id: '1', title: 'test' },
        newNodeTitle: 'test',
        nested: false,
      }),
    ).toThrow()
  })

  it('nested가 true이면, 소스 노드의 첫번째 자식에 노드 생성', () => {
    vi.mocked(uuid.v4).mockReturnValueOnce('n-1' as any)

    const entity: TreeEntity = {
      rootNodeId: 'n',
      nodeTable: new Map([
        [
          'n',
          {
            id: 'n',
            childNodeIds: ['n-2'],
            parentNodeId: undefined,
            task: {
              id: 't',
              title: 't',
              done: false,
            },
          },
        ],
        [
          'n-2',
          {
            id: 'n-2',
            childNodeIds: [],
            parentNodeId: 'n',
            task: {
              id: 't-2',
              title: 't-2',
              done: false,
            },
          },
        ],
      ]),
    }

    const { entity: newEntity, newNode } = insertNewNodeAfter({
      entity,
      sourceNode: { id: 'n', title: 't-a' },
      newNodeTitle: 't-1',
      nested: true,
    })

    const newSourceNode = getNode({
      entity: newEntity.nodeTable,
      nodeId: 'n',
    })!

    expect(getChildNodeIds({ entity: newSourceNode })).toEqual(['n-1', 'n-2'])
    expect(getTaskTitle({ entity: newSourceNode })).toEqual('t-a')
    expect(getNode({ entity: newEntity.nodeTable, nodeId: newNode.id })).toEqual(newNode)
    expect(getTaskTitle({ entity: newNode })).toEqual('t-1')
    expect(getParentNodeId({ entity: newNode })).toEqual('n')
    expect(getNode({ entity: entity.nodeTable, nodeId: 'n-2' })).toEqual(
      getNode({ entity: newEntity.nodeTable, nodeId: 'n-2' }),
    )
  })

  it('nested가 false이면, 소스 노드의 다음 친구 노드에 노드 생성', () => {
    vi.mocked(uuid.v4).mockReturnValueOnce('n-2' as any)

    const entity: TreeEntity = {
      rootNodeId: 'n',
      nodeTable: new Map([
        [
          'n',
          {
            id: 'n',
            childNodeIds: ['n-1', 'n-3'],
            parentNodeId: undefined,
            task: {
              id: 't',
              title: 't',
              done: false,
            },
          },
        ],
        [
          'n-1',
          {
            id: 'n-1',
            childNodeIds: [],
            parentNodeId: 'n',
            task: {
              id: 't-1',
              title: 't-1',
              done: false,
            },
          },
        ],
        [
          'n-3',
          {
            id: 'n-3',
            childNodeIds: [],
            parentNodeId: 'n',
            task: {
              id: 't-3',
              title: 't-3',
              done: false,
            },
          },
        ],
      ]),
    }

    const { entity: newEntity, newNode } = insertNewNodeAfter({
      entity,
      sourceNode: { id: 'n-1', title: 't-1-a' },
      newNodeTitle: 't-2',
      nested: false,
    })

    const newSourceNode = getNode({
      entity: newEntity.nodeTable,
      nodeId: 'n-1',
    })!

    const newParentNode = getNode({
      entity: newEntity.nodeTable,
      nodeId: 'n',
    })!

    expect(getParentNodeId({ entity: newSourceNode })).toEqual('n')
    expect(getChildNodeIds({ entity: newSourceNode })).toEqual([])
    expect(getTaskTitle({ entity: newSourceNode })).toEqual('t-1-a')
    expect(getChildNodeIds({ entity: newParentNode })).toEqual(['n-1', 'n-2', 'n-3'])
    expect(getNode({ entity: newEntity.nodeTable, nodeId: newNode.id })).toEqual(newNode)
    expect(getTaskTitle({ entity: newNode })).toEqual('t-2')
    expect(getParentNodeId({ entity: newNode })).toEqual('n')
  })
})

describe('outdentNode', () => {
  it('대상 노드가 없을때, Outdent하면 이전 엔티티 그대로 반환한다', () => {
    const entity: TreeEntity = {
      rootNodeId: 'n',
      nodeTable: new Map([
        [
          'n',
          {
            id: 'n',
            childNodeIds: [],
            parentNodeId: undefined,
            task: {
              id: 't',
              title: 't',
              done: false,
            },
          },
        ],
      ]),
    }

    const newEntity = outdentNode({ entity, nodeId: 'n-1' })
    expect(newEntity).toEqual(entity)
  })

  it('조상 노드가 없을때, Outdent하면 이전 엔티티 그대로 반환한다', () => {
    const entity: TreeEntity = {
      rootNodeId: 'n',
      nodeTable: new Map([
        [
          'n',
          {
            id: 'n',
            childNodeIds: [],
            parentNodeId: undefined,
            task: {
              id: 't',
              title: 't',
              done: false,
            },
          },
        ],
      ]),
    }
    const newEntity = outdentNode({ entity, nodeId: 'n' })
    expect(newEntity).toEqual(entity)
  })

  it('조상 노드가 있을때, Outdent하면 부모 노드의 다음 친구 노드로 이동한다', () => {
    const entity: TreeEntity = {
      rootNodeId: 'n',
      nodeTable: new Map([
        [
          'n',
          {
            id: 'n',
            childNodeIds: ['n-1'],
            parentNodeId: undefined,
            task: {
              id: 't',
              title: 't',
              done: false,
            },
          },
        ],
        [
          'n-1',
          {
            id: 'n-1',
            childNodeIds: ['n-2', 'n-1-1'],
            parentNodeId: 'n',
            task: {
              id: 't-1',
              title: 't-1',
              done: false,
            },
          },
        ],
        [
          'n-2',
          {
            id: 'n-2',
            childNodeIds: [],
            parentNodeId: 'n-1',
            task: {
              id: 't-2',
              title: 't-2',
              done: false,
            },
          },
        ],
        [
          'n-1-1',
          {
            id: 'n-1-1',
            childNodeIds: [],
            parentNodeId: 'n-1',
            task: {
              id: 't-1-1',
              title: 't-1-1',
              done: false,
            },
          },
        ],
      ]),
    }

    const newEntity = outdentNode({ entity, nodeId: 'n-2' })
    const newParentNode = getNode({
      entity: newEntity.nodeTable,
      nodeId: 'n',
    })!

    const newSiblingNode = getNode({
      entity: newEntity.nodeTable,
      nodeId: 'n-1',
    })!

    expect(getChildNodeIds({ entity: newParentNode })).toEqual(['n-1', 'n-2'])
    expect(getChildNodeIds({ entity: newSiblingNode })).toEqual(['n-1-1'])
    expect(
      getNode({
        entity: newEntity.nodeTable,
        nodeId: 'n-1-1',
      }),
    ).toEqual(
      getNode({
        entity: entity.nodeTable,
        nodeId: 'n-1-1',
      }),
    )
  })
})

describe('indentNode', () => {
  it('대상 노드가 없을때, Indent하면 이전 엔티티 그대로 반환한다', () => {
    const entity: TreeEntity = {
      rootNodeId: 'n',
      nodeTable: new Map([
        [
          'n',
          {
            id: 'n',
            childNodeIds: [],
            parentNode: undefined,
            task: {
              id: 't',
              title: 't',
              done: false,
            },
          },
        ],
      ]),
    }

    const newEntity = indentNode({ entity, nodeId: 'n-1' })
    expect(newEntity).toEqual(entity)
  })

  it('이전 친구 노드가 없을때, Indent하면 이전 엔티티 그대로 반환한다', () => {
    const entity: TreeEntity = {
      rootNodeId: 'n',
      nodeTable: new Map([
        [
          'n',
          {
            id: 'n',
            childNodeIds: ['n-1'],
            parentNode: undefined,
            task: {
              id: 't',
              title: 't',
              done: false,
            },
          },
        ],
        [
          'n-1',
          {
            id: 'n-1',
            childNodeIds: [],
            parentNode: 'n',
            task: {
              id: 't-1',
              title: 't-1',
              done: false,
            },
          },
        ],
      ]),
    }

    const newEntity = indentNode({ entity, nodeId: 'n-1' })
    expect(newEntity).toEqual(entity)
  })

  it('이전 친구 노드가 있을때, Indent하면 이전 친구 노드의 자식 노드로 이동한다', () => {
    const entity: TreeEntity = {
      rootNodeId: 'n',
      nodeTable: new Map([
        [
          'n',
          {
            id: 'n',
            childNodeIds: ['n-1', 'n-1-2'],
            parentNodeId: undefined,
            task: {
              id: 't',
              title: 't',
              done: false,
            },
          },
        ],
        [
          'n-1',
          {
            id: 'n-1',
            childNodeIds: ['n-1-1'],
            parentNodeId: 'n',
            task: {
              id: 't-1',
              title: 't-1',
              done: false,
            },
          },
        ],
        [
          'n-1-1',
          {
            id: 'n-1-1',
            childNodeIds: [],
            parentNodeId: 'n-1',
            task: {
              id: 't-1-1',
              title: 't-1-1',
              done: false,
            },
          },
        ],
        [
          'n-1-2',
          {
            id: 'n-1-2',
            childNodeIds: [],
            parentNodeId: 'n',
            task: {
              id: 't-1-2',
              title: 't-1-2',
              done: false,
            },
          },
        ],
      ]),
    }

    const newEntity = indentNode({ entity, nodeId: 'n-1-2' })
    const parentNode = getNode({
      entity: newEntity.nodeTable,
      nodeId: 'n',
    })!

    const siblingNode = getNode({
      entity: newEntity.nodeTable,
      nodeId: 'n-1',
    })!

    const targetNode = getNode({
      entity: newEntity.nodeTable,
      nodeId: 'n-1-1',
    })!

    expect(getParentNodeId({ entity: targetNode })).toEqual('n-1')
    expect(getChildNodeIds({ entity: parentNode })).toEqual(['n-1'])
    expect(getChildNodeIds({ entity: siblingNode })).toEqual(['n-1-1', 'n-1-2'])
  })
})
