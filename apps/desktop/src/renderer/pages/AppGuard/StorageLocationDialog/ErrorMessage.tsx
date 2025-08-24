import { Alert, AlertDescription } from '@/renderer/common/Alert'

interface ErrorMessageProps {
  error: unknown
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null

  const message = error instanceof Error ? error.message : '오류가 발생했습니다'

  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
