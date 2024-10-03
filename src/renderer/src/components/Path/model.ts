import { ElementType } from 'react'

export interface PointModel {
  icon?: ElementType
  text: string
  url: string
}

export interface PathModel {
  points: PointModel[]
}

export const getFirstPoint = ({ points }: PathModel): PointModel | undefined =>
  points.length > 0 ? points[0] : undefined

export const getLastPoint = ({ points }: PathModel): PointModel | undefined =>
  points.length > 1 ? points[points.length - 1] : undefined

export const getMidPoints = ({ points }: PathModel): PointModel[] =>
  points.length > 2 ? points.slice(1, points.length - 1) : []
