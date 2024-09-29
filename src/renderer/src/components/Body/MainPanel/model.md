```mermaid
classDiagram
  MainPanel --> Body: export

  namespace mainPanel {
    class MainPanel {
      <<main panel layout>>
    }

    class Title {
      <<title ui>>
      icon: string
      name: string
    }

    class MainPanelHeader {
      <<connected title ui with store>>
    }

    class MainPanelBody {
      <<main panel layout>>
    }

    class Scroller {
      <<make scroll util component>>
    }
    class mainPanelStore
  }

  Title --> MainPanelHeader
Scroller --> MainPanel
  MainPanelHeader --> MainPanel
  MainPanelBody --> MainPanel
  TreeView --> MainPanelBody: export

  namespace mainPanelStore {
    class MainPanelStore {
      <<main panel state store>>
      title: Title
      setHeader(header: Header)
    }

    class Title {
      <<title data>>
      icon: string
      name: string
    }
  }

  Header --> MainPanelStore
  MainPanelStore --> MainPanelHeader
```
