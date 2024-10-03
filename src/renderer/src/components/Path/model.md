```mermaid
classDiagram
	namespace path {
		class PathBlock {
			<<path layout>>
		}

		class FirstPointLink {
			<<first point layout>>
		}

		class MidPathSegment {
			<<middle point layout>>
		}

		class LastPointLink {
			<<last point layout>>
		}

		class PointLink {
			<<point ui>>
			icon?: Icon
			text: string
			link: string
		}

		class pathStore
		class ellipsisMenu
	}

	FirstPointLink --> PathBlock
	MidPathSegment --> PathBlock
	LastPointLink --> PathBlock
	PointLink -->	FirstPointLink
	PointLink -->	MidPathSegment
	PointLink -->	LastPointLink
	PathStore --> FirstPointLink
	PathStore --> MidPathSegment
	PathStore --> LastPointLink
	EllipsisMenu --> MidPathSegment: export
  PathBlock --> TopBar: export

	namespace pathStore {
		class PathStore {
			<<Path state store>>
			path: PathModel
		}

    class PathModel {
			<<path data structure>>
      points: Point[]
      getFirstPoint(path: PathModel) PointModel | undefined
      getLastPoint(path: PathModel) PointModel | undefined
      getMidPoints(path: PathModel) PointModel[]
    }

		class PointModel {
			<<point data structure>>
			icon?: Icon
			text: string
			url: string
		}
	}

  PointModel --> PathModel
	PathModel --> PathStore

	namespace ellipsisMenu {
		class EllipsisMenu {
			<<path ellipsis ui>>
			points: PointModel[]
		}

		class MenuButton {
			<<path ellipsis button ui>>
		}

		class Popover {
			<<path ellipsis popover ui>>
		}
	}

  PointModel --> EllipsisMenu
	MenuButton --> EllipsisMenu
	Popover --> EllipsisMenu
	PointLink --> EllipsisMenu
```
