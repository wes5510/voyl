export const isModelPath = ({ absolutePath }: { absolutePath: string }) => {
  return absolutePath.includes('/models/')
}

export const getModelName = ({ absolutePath }: { absolutePath: string }) => {
  const match = absolutePath.match(/\/models\/([^/]+)/)
  return match ? match[1] : null
}

export const isSameModel = ({
  absoluteFilePath,
  absoluteImportPath,
}: {
  absoluteFilePath: string
  absoluteImportPath: string
}) => {
  const fileModel = getModelName({ absolutePath: absoluteFilePath })
  const importModel = getModelName({ absolutePath: absoluteImportPath })
  return fileModel && importModel && fileModel === importModel
}
