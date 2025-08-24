import StorageLocationDialog from './StorageLocationDialog'

export default function AppGuard() {
  // index.tsx에서 초기화되지 않은 경우에만 이 컴포넌트를 렌더링
  return <StorageLocationDialog />
}