import TreeViewItemWrapper from './shared/Wrapper'
import CollapseIcon from './shared/CollapseIcon'
import DotIcon from './shared/DotIcon'

export default function DraggingTreeviewItem() {
  const title = ''
  const depth = 0

  return (
    <TreeViewItemWrapper depth={depth}>
      <div className="flex h-6 w-6 items-center justify-center">
        <CollapseIcon expanded={false} />
      </div>
      <div className="flex h-6 w-6 items-center justify-center">
        <DotIcon />
      </div>
      <div className="flex-1">{title}</div>
    </TreeViewItemWrapper>
  )
}
