```mermaid
classDiagram
  MainPanel --> Body: export

  namespace mainPanel {
    class MainPanel

    class Title {
      icon: string
      name: string
    }

    class MainPanelHeader

    class MainPanelBody
    class mainPanelStore
  }

  Title --> MainPanelHeader
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
