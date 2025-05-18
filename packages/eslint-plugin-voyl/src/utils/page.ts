export const isPagesPath = ({ absolutePath }: { absolutePath: string }) => {
  return absolutePath.includes('/pages/')
}
