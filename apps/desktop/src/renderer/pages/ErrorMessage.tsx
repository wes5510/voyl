interface ErrorMessageProps {
  error: unknown
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null
  
  const message = error instanceof Error ? error.message : '오류가 발생했습니다'
  
  return (
    <div className="rounded-lg border border-destructive/50 text-destructive px-4 py-3 text-sm">
      {message}
    </div>
  )
}