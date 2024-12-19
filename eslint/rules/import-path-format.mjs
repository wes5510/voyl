import path from 'path'

/**
 * Checks if the import path is within the same component scope
 * Component scope is determined by the first directory after /components/
 */
const isWithinComponentScope = (currentFile, resolvedPath) => {
  if (!resolvedPath.includes('/components/') || !currentFile.includes('/components/')) {
    return false
  }

  const currentComponent = currentFile.split('/components/')[1].split('/')[0]
  const targetComponent = resolvedPath.split('/components/')[1].split('/')[0]
  return currentComponent === targetComponent
}

/**
 * Validates relative path imports
 * Allows:
 * - Imports from the same directory (./)
 * - Imports from shared directory within the same component scope (../shared/)
 */
const checkRelativeImport = (context, node, { importPath, currentFile, currentDir }) => {
  const resolvedPath = path.resolve(currentDir, importPath)

  // Check upper directory references
  if (importPath.includes('../')) {
    const withinScope = isWithinComponentScope(currentFile, resolvedPath)
    if (!withinScope || !resolvedPath.includes('/shared/')) {
      context.report({
        node,
        message: 'Upper directory references are not allowed. Use absolute paths (@/) instead',
      })
      return false
    }
    return true
  }

  // Check relative path patterns
  if (!importPath.startsWith('./') && !importPath.startsWith('../shared/')) {
    context.report({
      node,
      message: 'Relative imports must start with ./ or ../shared/',
    })
    return false
  }

  return true
}

/**
 * Validates shared components imports
 * Prevents importing shared components from lower levels
 */
const checkSharedComponentsImport = (context, node, { importPath, currentLevel }) => {
  const importLevel = importPath.split('/').filter((p) => p !== '').length
  if (importLevel > currentLevel) {
    context.report({
      node,
      message: 'Cannot import shared components from lower levels',
    })
    return false
  }
  return true
}

/**
 * Validates component imports
 * Ensures components are only imported from the same level
 */
const checkComponentsImport = (context, node, { importPath, currentLevel }) => {
  if (!importPath.includes('/shared/components/')) {
    const importLevel = importPath.split('/').filter((p) => p !== '').length
    if (importLevel !== currentLevel) {
      context.report({
        node,
        message: 'Components can only be imported from the same level',
      })
      return false
    }
  }
  return true
}

/**
 * Prevents importing shared elements from other components
 * Each component's shared directory should be encapsulated
 */
const checkOtherComponentSharedImport = (context, node, { importPath }) => {
  if (importPath.includes('/components/') && importPath.includes('/shared/')) {
    context.report({
      node,
      message: "Cannot import other component's shared elements",
    })
    return false
  }
  return true
}

export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce import path format in pages directory',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const currentFile = context.getFilename()

        // Basic validation
        if (!currentFile.includes('/pages/')) return
        if (path.basename(currentFile) === 'index.tsx') return
        if (!importPath.startsWith('.') && !importPath.startsWith('@')) return

        const currentDir = path.dirname(currentFile)
        const pagesIndex = currentFile.indexOf('/pages/')
        const relativePath = currentFile.slice(pagesIndex + 7)
        const currentLevel = relativePath.split('/').filter(Boolean).length

        const params = {
          importPath,
          currentFile,
          currentDir,
          currentLevel,
        }

        // Check relative path imports
        if (importPath.startsWith('.')) {
          return checkRelativeImport(context, node, params)
        }

        // Check absolute path imports
        if (importPath.startsWith('@/')) {
          if (importPath.includes('/shared/components/')) {
            if (!checkSharedComponentsImport(context, node, params)) return
          }

          if (importPath.includes('/components/')) {
            if (!checkComponentsImport(context, node, params)) return
            if (!checkOtherComponentSharedImport(context, node, params)) return
          }
        }
      },
    }
  },
}
