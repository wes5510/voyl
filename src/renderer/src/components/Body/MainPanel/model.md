```mermaid
classDiagram
  MainPanel --> Body: export

  namespace mainPanel {
    class MainPanel

    class MainPanelHeader {
      icon: string
      name: string
    }

    class MainPanelBody
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
```
