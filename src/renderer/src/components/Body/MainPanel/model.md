```mermaid
classDiagram
  MainPanel --> Body: export

  namespace mainPanel {
    class MainPanel {
      <<main panel layout>>
    }

    class MainPanelHeader {
      <<main header ui>>
    }

    class MainPanelBody {
      <<main panel layout>>
    }

    class Scroller {
      <<make scroll util component>>
    }
    class mainPanelStore
  }

  Scroller --> MainPanel
  MainPanelHeader --> MainPanel
  MainPanelBody --> MainPanel
  TreeView --> MainPanelBody: export

  namespace mainPanelStore {
    class MainPanelStore {
      <<main panel state store>>
      title: TitleModel
    }

    class TitleModel {
      <<title data>>
      icon: string
      name: string
    }
  }

  MainPanelStore --> MainPanelHeader
```
