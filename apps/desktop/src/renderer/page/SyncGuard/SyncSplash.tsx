import Spinner from '@/renderer/common/Spinner'

export default function SyncSplash() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <Spinner className="size-8" />
      <p className="text-muted-foreground">워크스페이스 동기화 중...</p>
    </div>
  )
}
