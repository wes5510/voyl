```mermaid
classDiagram
  namespace body {
    class Body
    class mainPanel
    class sidePanel
  }
  MainPanel --> Body: export
  sidePanel --> Body: export

  namespace mainPanel {
    class MainPanel

    class MainPanelHeader {
      icon: string
      name: string
    }

    class MainPanelBody
    class treeView
    class mainPanelStore
  }

  MainPanelHeader --> MainPanel
  MainPanelBody --> MainPanel
  TreeView --> MainPanelBody: export

  namespace mainPanelStore {
    class MainPanelStore {
      header: Header
      setHeader(header: Header)
    }

    class Header {
      icon: string
      name: string
    }
  }

  Header --> MainPanelStore
  MainPanelStore --> MainPanelHeader

  namespace treeView {
    class TreeView {
    }

    class AddTreeViewItemButton {
    }

    class treeViewItem
    class treeStore
  }

  AddTreeViewItemButton --> TreeView
  TreeViewItem --> TreeView: export
  MainPanelStore --> TreeViewItem

  namespace treeViewItem {
    class TreeViewItem {
      nodeId: string
    }

    class TreeViewItemName {
      nodeId: string
    }
  }

  TreeViewItemName --> TreeViewItem

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
