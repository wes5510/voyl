```mermaid
classDiagram
	namespace path {
		class PathBlock {
			<<Path Layout>>
		}

		class FirstPointLink {
			<<First Point UI>>
			getFirstPoint()
		}

		class MidPathSegment {
			<<Middle Point UI>>
			getMidPoints()
		}

		class LastPointLink {
			<<Last Point UI>>
			getLastPoint()
		}

		class PointLink {
			<<Point UI>>
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
	pathStore --> FirstPointLink
	pathStore --> MidPathSegment
	pathStore --> LastPointLink
	EllipsisMenu --> MidPathSegment: Export

	namespace pathStore {
		class Path {
			<<Path Data Structure>>
			points: Point[]
			set(points: Point[])
		}

		class Point {
			<<Point Data Structure>>
			icon?: Icon
			text: string
			url: string
		}
	}

	Point --> Path

	namespace ellipsisMenu {
		class EllipsisMenu {
			<<Path Ellipsis UI>>
			points: Points[]
		}

		class MenuButton {
			<<Path Ellipsis Button UI>>
		}

		class Popover {
			<<Path Ellipsis Popover UI>>
		}
	}

	MenuButton --> EllipsisMenu
	Popover --> EllipsisMenu
	PointLink --> EllipsisMenu
```
