```mermaid
classDiagram
	namespace path {
		class PathBlock {
			<<path layout>>
		}

		class FirstPointLink {
			<<first point layout>>
			getFirstPoint(points: Point[])
		}

		class MidPathSegment {
			<<middle point layout>>
			getMidPoints(points: Point[])
		}

		class LastPointLink {
			<<last point layout>>
			getLastPoint(points: Point[])
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
			<<path state store>>
			points: Point[]
			set(points: Point[])
		}

		class Point {
			<<point data structure>>
			icon?: Icon
			text: string
			url: string
		}
	}

	Point --> PathStore

	namespace ellipsisMenu {
		class EllipsisMenu {
			<<path ellipsis ui>>
			points: Points[]
		}

		class MenuButton {
			<<path ellipsis button ui>>
		}

		class Popover {
			<<path ellipsis popover ui>>
		}
	}

	MenuButton --> EllipsisMenu
	Popover --> EllipsisMenu
	PointLink --> EllipsisMenu
```
