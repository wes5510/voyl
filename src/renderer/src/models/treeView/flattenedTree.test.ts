import { describe, expect, it } from 'vitest'
import { initFlattenedTree } from './flattenedTree'

describe('flattenedTree', () => {
  it('노드가 없으면, 빈 배열을 반환한다.', () => {
    const entity = {
      nodes: [],
      expandedNodeIds: [],
      rootNodeId: '',
    }

    const nodeTable = new Map()

    const newEntity = initFlattenedTree({ entity, rootNodeId: '', nodeTable })

    expect(newEntity).toEqual({
      nodes: [],
      expandedNodeIds: [],
      rootNodeId: '',
    })
  })

  it('Root Node만 있으면, 빈 배열을 반환한다.', () => {
    const entity = {
      nodes: [],
      expandedNodeIds: [],
      rootNodeId: '',
    }

    const nodeTable = new Map([
      [
        '1',
        {
          id: '1',
          title: '1',
          parentId: null,
          childNodeIds: [],
          task: {
            id: '1',
            title: '1',
            done: false,
          },
        },
      ],
    ])

    const newEntity = initFlattenedTree({ entity, rootNodeId: '1', nodeTable })

    expect(newEntity).toEqual({
      nodes: [],
      expandedNodeIds: [],
      rootNodeId: '1',
    })
  })

  it('접혀있는 노드가 주어지면, 자식 노드들은 평면화된 트리에 포함되지 않는다.', () => {
    const entity = {
      nodes: [],
      expandedNodeIds: [],
      rootNodeId: '',
    }

    const nodeTable = new Map([
      [
        '0',
        {
          id: '0',
          parentId: null,
          childNodeIds: ['1'],
          task: {
            id: '0',
            title: '0',
            done: false,
          },
        },
      ],
      [
        '1',
        {
          id: '1',
          parentId: '0',
          childNodeIds: ['1-1'],
          task: {
            id: '1',
            title: '1',
            done: false,
          },
        },
      ],
      [
        '1-1',
        {
          id: '1-1',
          parentId: '1',
          childNodeIds: [],
          task: {
            id: '1-1',
            title: '1-1',
            done: false,
          },
        },
      ],
    ])

    const newEntity = initFlattenedTree({ entity, rootNodeId: '0', nodeTable })

    expect(newEntity).toEqual({
      nodes: [
        {
          id: '1',
          depth: 0,
          expanded: false,
          childNodeIds: ['1-1'],
        },
      ],
      expandedNodeIds: [],
      rootNodeId: '0',
    })
  })

  it('tree 구조가 주어지면, 확장된 노드들을 기준으로 평면화된 트리 노드 배열을 반환한다', () => {
    const entity = {
      nodes: [],
      expandedNodeIds: ['1', '1-1', '1-2', '1-1-1', '2'],
      rootNodeId: '',
    }

    const nodeTable = new Map([
      [
        '0',
        {
          id: '0',
          title: '0',
          parentId: null,
          childNodeIds: ['1', '2'],
          task: {
            id: '0',
            title: '0',
            done: false,
          },
        },
      ],
      [
        '1-1',
        {
          id: '1-1',
          title: '1-1',
          parentId: '1',
          childNodeIds: ['1-1-1'],
          task: {
            id: '1-1',
            title: '1-1',
            done: false,
          },
        },
      ],

      [
        '1-2',
        {
          id: '1-2',
          title: '1-2',
          parentId: '1',
          childNodeIds: [],
          task: {
            id: '1-2',
            title: '1-2',
            done: false,
          },
        },
      ],
      [
        '2',
        {
          id: '2',
          title: '2',
          parentId: '0',
          childNodeIds: [],
          task: {
            id: '2',
            title: '2',
            done: false,
          },
        },
      ],
      [
        '1',
        {
          id: '1',
          title: '1',
          parentId: '0',
          childNodeIds: ['1-1', '1-2'],
          task: {
            id: '1',
            title: '1',
            done: false,
          },
        },
      ],
      [
        '1-1-1',
        {
          id: '1-1-1',
          title: '1-1-1',
          parentId: '1-1',
          childNodeIds: [],
          task: {
            id: '1-1-1',
            title: '1-1-1',
            done: false,
          },
        },
      ],
    ])

    const newEntity = initFlattenedTree({ entity, rootNodeId: '0', nodeTable })

    expect(newEntity).toEqual({
      ...entity,
      nodes: [
        {
          id: '1',
          depth: 0,
          expanded: true,
          childNodeIds: ['1-1', '1-2'],
        },
        {
          id: '1-1',
          depth: 1,
          expanded: true,
          childNodeIds: ['1-1-1'],
        },
        {
          id: '1-1-1',
          depth: 2,
          expanded: true,
          childNodeIds: [],
        },
        {
          id: '1-2',
          depth: 1,
          expanded: true,
          childNodeIds: [],
        },
        {
          id: '2',
          depth: 0,
          expanded: true,
          childNodeIds: [],
        },
      ],
      rootNodeId: '0',
    })
  })
})
