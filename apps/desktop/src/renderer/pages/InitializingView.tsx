import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/renderer/common/Dialog.js'

export default function InitializingView() {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">워크스페이스를 설정하고 있습니다...</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}