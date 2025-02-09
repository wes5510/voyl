'use strict'

const isFeaturePath = (absolutePath) => {
  return absolutePath.includes('/features/')
}

const getFeatureName = (absolutePath) => {
  const match = absolutePath.match(/\/features\/([^/]+)\//)
  return match ? match[1] : null
}

const isSameFeature = (absoluteFilePath, absoluteImportPath) => {
  const fileFeature = getFeatureName(absoluteFilePath)
  const importFeature = getFeatureName(absoluteImportPath)
  return fileFeature && importFeature && fileFeature === importFeature
}

module.exports = {
  isFeaturePath,
  getFeatureName,
  isSameFeature,
}
