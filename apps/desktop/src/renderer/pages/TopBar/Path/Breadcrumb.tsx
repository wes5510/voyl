export interface BreadcrumbProps {
  children: React.ReactNode
}

export default function Breadcrumb({ children }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" data-slot="breadcrumb">
      <ol
        data-slot="breadcrumb-list"
        className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5"
      >
        {children}
      </ol>
    </nav>
  )
}
