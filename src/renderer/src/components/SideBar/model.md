```mermaid
classDiagram
	namespace sideBar {
		class SideBar {
			<<side bar layout>>
		}

		class Divider {
			<<side bar divider ui>>
		}

		class TooltipButton {
      <<tooltip button ui>>
    }
    class appMenu
    class favoriteMenu
	}

	Divider --> SideBar

  namespace favoriteMenu {
    class FavoritesMenu {
			<<favorite buttons layout>>
		}

		class CharButton {
      <<favorite button ui>>
    }
  }

	CharButton --> FavoritesMenu
	TooltipButton --> CharButton
	FavoritesMenu --> SideBar: export
	favoriteStore -->	FavoritesMenu: export

  namespace appMenu {
    class AppMenu {
			<<app(system) buttons layout>>
		}

		class IconButton {
      <<app(system) button ui>>
    }

  }

  IconButton --> AppMenu
	TooltipButton --> IconButton
	AppMenu --> SideBar: export
```
