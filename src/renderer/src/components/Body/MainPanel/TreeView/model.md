```mermaid
classDiagram
  TreeView --> MainPanelBody: export

  namespace treeView {
    class TreeView {
      <<tree layout>>
    }

    class AddButton {
      <<add button ui>>
    }

    class AddTreeViewItemButton {
      <<connected AddButton with treeStore for add tree view item>>
    }

    class treeViewItem
    class treeStore
  }

  AddButton --> AddTreeViewItemButton
  AddTreeViewItemButton --> TreeView
  TreeViewItem --> TreeView: export
  MainPanelStore --> TreeViewItem

  namespace treeViewItem {
    class TreeViewItem {
      <<tree view item layout>>
      nodeId: string
    }
  }

  namespace treeStore {
    class TreeStore {
      rootNodeId: string
      nodeMap: Map<string, Node>
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
      text: string
      parentId?: string
      index: number
      collapsed: boolean
      createNew(parentId: string, index: number) Node
      setParentId(parentId: string)
      setIndex(index: number)
      remove()
      collapse()
      updateText()
    }
  }

  Node --> TreeStore
  TreeStore --> TreeViewItem
  TreeStore --> TreeView
  TreeStore --> AddTreeViewItemButton
```
