# voyl

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

## Model

```mermaid
classDiagram
	class App {
		favoriteIds: string[]
		treeId: string
		addFavorite(thingId: string)
		removeFavorite(thingId: string)
	}

  namespace tree {
    class Tree
    class Node
    class Thing
  }

	class Tree {
    <<Tree Structure & Tree Root Entity>>
		nodeIds: string[]
    nodeTable: Map<string, Node>
    focusedNodeId: string
    + insertNewNodeAfter(nodeIds: string[], refNodeId: string, newNodeTitle: string)
    + removeNodeId(nodeIds: string[], nodeId: string)
    + incrementNodeDepth(node: Node)
    + decrementNodeDepth(node: Node)
    + updateNodeDepthByDelta(node: Node, depthDelta: number)
    + updateNodeCollapsed(node: Node, collapsed: boolean)
    + updateNodeDepth(node: Node, depth: number)
    + getNextNodeIdFromFocusedNodeId(nodeIds: string[], focusedNodeId?: string)
    + getPrevNodeIdFromFocusedNodeId(nodeIds: string[], focusedNodeId?: string)
    + indentNode(nodes: Node[], targetNode: Node)
    + outdentNode(nodes: Node[], targetNode: Node)
    + moveNodeIdsByRefNode(nodeIds: string[], refNodeId: string, targetNodeId: string)
    + removeChildNodes(nodes: Node[], parentNode: Node)
    + getValidNodeDepth(nodes: Node[], refNode: Node, targetNode: Node, deltaDepth: number)
    - moveBeforeNextLowerDepthNode(nodes: Node[], targetNode: Node)
    - moveByIndex(nodes: Node[], from: number, to: number)
    - insertAfter(nodeIds: string[], refNodeId: string, targetNodeId: string)
    - moveIdsByIndex(nodeIds: string[], from: number, to: number)
	}

  class Node {
    <<Thing Metadata & Node Relationship>>
    id: string
    depth: number
		collapsed: boolean
    thingId: string
    - getNextLowerDepthNodeIndex(nodes: Node[], targetNode: Node)
    - getParentNodeIndex(nodes: Node[], targetNode: Node)
    - incrementChildNodesDepth(nodes: Node[], targetNode: Node)
    - getNextNodeId(nodeIds: string[], nodeId?: string)
    - getPrevNodeId(nodeIds: string[], nodeId?: string)
    - hasParentNode(nodes: Node[], targetNode: Node)
    - getParentNode(nodes: Node[], targetNode: Node)
    - getChildNodes(parentNode: Node, nodes: Node[])
    - getDepthByNode(node: Node)
    - isSiblingNode(refNode: Node, targetNode: Node)
    - getPrevSiblingNode(nodes: Node[], targetNode: Node)
    - hasLowerDepth(comparedNode: Node, baseNode: Node)
    - decrementChildNodesDepth(nodes: Node[], targetNode: Node)
    - updateChildNodesDepth(nodes: Node[], targetNode: Node, depthDelta: number)
    - isChildNode(parentNode: Node, childNode: Node)
    - canHaveParentNode(targetNode: Node)
    - isParentNode(refNode: Node, targetNode: Node)
    - getMaxDepth(nodes: Node[], nodeId: string)
    - getPrevNode(nodes: Node[], nodeId?: string)
    - getMinDepth(nodes: Node[], nodeId: string)
    - getNextNode(nodes: Node[], nodeId?: string)
  }

	class Thing {
    <<Data>>
    id: string
    title: string
    content: string
    + create(depth: number, title?: string, collapsed?: boolean)
    + updateTitle(node: Node, title: string)
	}

	Tree "1" --> "1..*" Node
  Node "1" --> "1" Thing
```
