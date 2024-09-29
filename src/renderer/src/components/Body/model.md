```mermaid
classDiagram
  namespace body {
    class Body
    class mainPanel
    class SidePanel
  }
  MainPanel --> Body: export
  SidePanel --> Body: export

  namespace mainPanel {
    class MainPanel
  }
```
