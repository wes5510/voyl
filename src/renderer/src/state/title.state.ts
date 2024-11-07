import { atom } from 'jotai'
import { TitleModel } from '../model/title.model'
import ListIcon from '../component/Icon/ListIcon'

export const titleAtom = atom<TitleModel>({
  icon: ListIcon,
  text: 'Things',
})
