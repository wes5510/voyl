```mermaid
classDiagram
	namespace sideBar {
		class SideBar {
			<<side bar 레이아웃>>
		}

		class Divider {
			<<side bar divider UI>>
		}

		class OneButton
    class appMenu
    class favoriteMenu
	}

	Divider --> SideBar

  namespace favoriteMenu {
    class FavoritesMenu {
			<<favorite buttons layout>>
		}

		class CharButton {
      <<favorite button>>
    }
  }

	CharButton --> FavoritesMenu
	OneButton --> CharButton
	FavoritesMenu --> SideBar: export
	favoriteStore -->	FavoritesMenu: export

  namespace appMenu {
    class AppMenu {
			<<app(system) buttons layout>>
		}

		class IconButton {
      <<app(system) button UI>>
    }

  }

  IconButton --> AppMenu
	OneButton --> IconButton
	AppMenu --> SideBar: export
```
