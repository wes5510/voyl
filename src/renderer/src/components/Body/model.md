```mermaid
classDiagram
  namespace body {
    class Body
    class mainPanel
    class SidePanel {
      <<side panel layout>>
    }
  }
  MainPanel --> Body: export
  SidePanel --> Body: export

  namespace mainPanel {
    class MainPanel {
      <<main panel layout>>
    }
  }
```
