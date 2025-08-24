export default function InitializingView() {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-background border rounded-lg p-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">워크스페이스를 설정하고 있습니다...</p>
        </div>
      </div>
    </div>
  )
}