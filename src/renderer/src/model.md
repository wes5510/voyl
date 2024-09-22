```mermaid
classDiagram
	class app
  class topBar
  class sideBar
  class favorite
  class path

	topBar --> app
	sideBar --> app
  path --> topBar
  favorite --> sideBar
```
