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
		favoriteThingIds: string[]
		thingsTreeId: string
		addFavorite(thingId: string)
		removeFavorite(thingId: string)
	}
	
	class Bullet {
		id: string
		name: string
		note: string
	  createNew() Bullet
	  remove()
	  updateName(name: string)
	  updateNote(note: string)
	}
	
	class Tree {
		rootNodeId: string
		createNewNode()
		moveNode()
		indentNode()
		outdentNode()
		appendNode()
		prependChildrenNode()
		appendChildrenNode()
	}
	
	class Node {
		id: string
		bulletId?: string
		parentId?: string
		index: number
		collapsed: boolean
		createNew(parentId: string, index: number) Node
		setParentId(parentId: string)
		setIndex(index: number)
		remove()
		collapse()
	}
	
	Tree --> Node
	Node --> Bullet
```
