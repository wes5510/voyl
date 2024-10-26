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

	class Tree {
		rootNodeId: string
    insertAfter(nodeIds: string[], sourceNodeId: string, newNodeId: string)
	}

	class Node {
		id: string
    depth: number
    name: string
    note: string
		collapsed: boolean
    createNewNode(depth: number, text?: string, collapsed?: boolean)
    getDepthBySourceNode(collapsed: boolean, depth: number)
	}

	Tree "1" --> "1..*" Node
```
