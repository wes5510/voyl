import { atom } from 'jotai'
import { TitleModel } from './model'
import ListIcon from '../../Icon/ListIcon'

export const titleAtom = atom<TitleModel>({
  icon: ListIcon,
  text: 'Things'
})
