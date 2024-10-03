```mermaid
classDiagram
  namespace treeView {
    class TreeView {
      <<tree layout>>
    }

    class AddButton {
      <<add button ui>>
    }

    class TreeStore {
      <<tree state store>>
      nodes: NodeModel[]
    }

    class TreeModel {
      <<tree domain model>>
      nodes: NodeModel[]
      createNewNode()
      moveNode()
      indentNode()
      outdentNode()
      appendNode()
      prependChildrenNode()
      appendChildrenNode()
    }

    class treeViewItem
  }

  TreeView --> MainPanelBody: export
  AddButton --> TreeView
  TreeStore --> TreeView
  TreeStore --> AddTreeViewItemButton
  TreeModel --> TreeStore

  namespace treeViewItem {
    class TreeViewItem {
      <<tree view item layout>>
      nodeId: string
    }

    class NodeStore {
      <<node state store>>
    }
  }

  TreeViewItem --> TreeView: export
  NodeStore --> TreeStore: export

```
