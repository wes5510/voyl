import { PointEntity } from './point'

export interface PathEntity {
  points: PointEntity[]
}

export const getFirstPoint = ({ entity }: { entity: PathEntity }): PointEntity | undefined =>
  entity.points.length > 0 ? entity.points[0] : undefined

export const getLastPoint = ({ entity }: { entity: PathEntity }): PointEntity | undefined =>
  entity.points.length > 1 ? entity.points[entity.points.length - 1] : undefined

export const getMidPoints = ({ entity }: { entity: PathEntity }): PointEntity[] =>
  entity.points.length > 2 ? entity.points.slice(1, entity.points.length - 1) : []

export const getMidPoint = ({ entity }: { entity: PathEntity }): PointEntity | undefined => {
  const midPoints = getMidPoints({ entity })
  return midPoints.length > 0 ? midPoints[0] : undefined
}

export const getMidPointLength = ({ entity }: { entity: PathEntity }): number =>
  getMidPoints({ entity }).length
