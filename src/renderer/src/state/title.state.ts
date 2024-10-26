import { atom } from 'jotai'
import { TitleModel } from '../model/title.model'
import ListIcon from '../components/Icon/ListIcon'

export const titleAtom = atom<TitleModel>({
  icon: ListIcon,
  text: 'Things'
})
