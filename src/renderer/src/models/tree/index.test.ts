import { describe, expect, it, vi } from 'vitest'
import * as uuid from 'uuid'
import { insertNewNodeAfter, TreeEntity } from './index'
import { getNode } from './nodeTable'
import {
  getTaskTitle,
  getParentNodeId,
  getPrevSiblingNodeId,
  getNextSiblingNodeId,
  getChildNodeIds,
} from './node'

describe('insertNewNodeAfter', () => {
  it('소스 노드가 없으면 에러 발생', () => {
    expect(() =>
      insertNewNodeAfter({
        entity: {
          nodeTable: new Map(),
        },
        sourceNode: { id: '1', title: 'test' },
        newNodeTitle: 'test',
      }),
    ).toThrow()
  })

  it('소스 노드가 펼쳐져있으면 소스 노드의 첫번째 자식으로 노드 생성', () => {
    const uuidSpy = vi.spyOn(uuid, 'v4').mockReturnValue('n-3')

    const entity: TreeEntity = {
      nodeTable: new Map([
        [
          'n-1',
          {
            id: 'n-1',
            childNodeIds: ['n-2'],
            collapsed: false,
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
            collapsed: true,
            task: {
              id: 't-2',
              title: 'test',
              done: false,
            },
          },
        ],
      ]),
    }

    const newEntity = insertNewNodeAfter({
      entity,
      sourceNode: {
        id: 'n-1',
        title: 't-1-a',
      },
      newNodeTitle: 't-1-1',
    })

    const sourceNode = getNode({
      entity: newEntity.entity.nodeTable,
      nodeId: 'n-1',
    })

    const newNode = getNode({
      entity: newEntity.entity.nodeTable,
      nodeId: 'n-3',
    })

    const secondChildNode = getNode({
      entity: newEntity.entity.nodeTable,
      nodeId: 'n-2',
    })

    expect(getChildNodeIds({ entity: sourceNode! })).toEqual(['n-3', 'n-2'])
    expect(getTaskTitle({ entity: sourceNode! })).toEqual('t-1-a')
    expect(getPrevSiblingNodeId({ entity: secondChildNode! })).toEqual('n-3')
    expect(getPrevSiblingNodeId({ entity: newNode! })).toEqual(undefined)
    expect(getNextSiblingNodeId({ entity: newNode! })).toEqual('n-2')
    expect(getParentNodeId({ entity: newNode! })).toEqual('n-1')
    expect(getTaskTitle({ entity: newNode! })).toEqual('t-1-1')

    uuidSpy.mockRestore()
  })

  it('소스 노드가 접혀있으면 소스 노드의 다음 친구 노드에 노드 생성', () => {
    const uuidSpy = vi.spyOn(uuid, 'v4').mockReturnValue('n-2')

    const entity: TreeEntity = {
      nodeTable: new Map([
        [
          'n-1',
          {
            id: 'n-1',
            childNodeIds: [],
            nextSiblingNodeId: 'n-3',
            collapsed: true,
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
            prevSiblingNodeId: 'n-1',
            collapsed: true,
            task: {
              id: 't-3',
              title: 'test',
              done: false,
            },
          },
        ],
      ]),
    }

    const newEntity = insertNewNodeAfter({
      entity,
      sourceNode: {
        id: 'n-1',
        title: 't-1-a',
      },
      newNodeTitle: 't-2',
    })

    const sourceNode = getNode({
      entity: newEntity.entity.nodeTable,
      nodeId: 'n-1',
    })

    const thirdNode = getNode({
      entity: newEntity.entity.nodeTable,
      nodeId: 'n-3',
    })

    const newNode = getNode({
      entity: newEntity.entity.nodeTable,
      nodeId: 'n-2',
    })

    expect(getNextSiblingNodeId({ entity: sourceNode! })).toEqual('n-2')
    expect(getTaskTitle({ entity: sourceNode! })).toEqual('t-1-a')
    expect(getPrevSiblingNodeId({ entity: thirdNode! })).toEqual('n-2')
    expect(getPrevSiblingNodeId({ entity: newNode! })).toEqual('n-1')
    expect(getNextSiblingNodeId({ entity: newNode! })).toEqual('n-3')
    expect(getTaskTitle({ entity: newNode! })).toEqual('t-2')

    uuidSpy.mockRestore()
  })
})
