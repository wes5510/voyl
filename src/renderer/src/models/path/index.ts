import { PointEntity } from './point'

export interface PathEntity {
  points: PointEntity[]
}

export const getFirstPoint = ({ points }: PathEntity): PointEntity | undefined =>
  points.length > 0 ? points[0] : undefined

export const getLastPoint = ({ points }: PathEntity): PointEntity | undefined =>
  points.length > 1 ? points[points.length - 1] : undefined

export const getMidPoints = ({ points }: PathEntity): PointEntity[] =>
  points.length > 2 ? points.slice(1, points.length - 1) : []

export const getMidPoint = ({ points }: PathEntity): PointEntity | undefined => {
  const midPoints = getMidPoints({ points })
  return midPoints.length > 0 ? midPoints[0] : undefined
}

export const getMidPointLength = ({ points }: PathEntity): number => getMidPoints({ points }).length
