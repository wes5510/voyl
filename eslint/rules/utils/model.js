'use strict'

const isModelPath = (absolutePath) => {
  return absolutePath.includes('/models/')
}

const getModelName = (absolutePath) => {
  const match = absolutePath.match(/\/models\/([^/]+)/)
  return match ? match[1] : null
}

const isSameModel = (absoluteFilePath, absoluteImportPath) => {
  const fileModel = getModelName(absoluteFilePath)
  const importModel = getModelName(absoluteImportPath)
  return fileModel && importModel && fileModel === importModel
}

module.exports = {
  isModelPath,
  getModelName,
  isSameModel,
}
