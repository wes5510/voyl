```mermaid
classDiagram
	class app
  class topBar
  class sideBar
  class favorite
  class path
  class body

	topBar --> app
	sideBar --> app
  body --> app
  path --> topBar
  favorite --> sideBar
```
