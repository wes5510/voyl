import path from 'node:path'
import fs from 'node:fs'

// Constants for file extensions and import patterns
const VALID_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']
const ALIAS_PREFIX = '@/'
const INDEX_FILE = 'index.tsx'

/**
 * Debug logger function
 * Only logs when DEBUG environment variable is set
 */
const debug = (message, ...args) => {
  if (process.env.DEBUG) {
    console.log(`[import-path-format] ${message}`, ...args)
  }
}

/**
 * File system utility functions for handling file operations
 */
const FileSystem = {
  /**
   * Find a file with valid extensions or as an index file
   * @param {string} basePath - Base path to search for the file
   * @returns {string|null} Full path of the found file or null if not found
   */
  findFile(basePath) {
    // Try direct file match with extensions
    for (const ext of VALID_EXTENSIONS) {
      const fullPath = basePath + ext
      if (fs.existsSync(fullPath)) {
        return fullPath
      }
    }

    // Try index file with extensions
    for (const ext of VALID_EXTENSIONS) {
      const indexPath = path.join(basePath, `index${ext}`)
      if (fs.existsSync(indexPath)) {
        return indexPath
      }
    }

    return null
  },

  /**
   * Load TypeScript path aliases from tsconfig
   * @returns {Object} Path mappings from tsconfig or empty object if not found
   */
  loadTsConfig() {
    try {
      const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.web.json')
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))
      return tsconfig.compilerOptions?.paths || {}
    } catch (error) {
      debug('Failed to load tsconfig:', error)
      return {}
    }
  },
}

/**
 * Path utilities for handling import path resolution
 */
const PathUtils = {
  /**
   * Check if the import is a project-internal import
   * @param {string} importPath - Import path to check
   * @returns {boolean} True if it's a project import
   */
  isProjectImport(importPath) {
    return (
      importPath.startsWith('./') ||
      importPath.startsWith('../') ||
      importPath.startsWith(ALIAS_PREFIX)
    )
  },

  /**
   * Resolve alias path to actual file system path
   * @param {string} importPath - Import path with alias
   * @param {Object} tsPaths - TypeScript path mappings
   * @returns {string|null} Resolved path or null if not found
   */
  resolveAliasPath(importPath, tsPaths) {
    for (const [alias, [pathPattern]] of Object.entries(tsPaths)) {
      const aliasPattern = alias.replace('/*', '')
      if (importPath.startsWith(aliasPattern)) {
        const relativePath = importPath.slice(aliasPattern.length)
        const resolvedPath = pathPattern.replace('*', relativePath)
        return path.resolve(process.cwd(), resolvedPath)
      }
    }
    return null
  },

  /**
   * Resolve import path to actual file system path
   * @param {string} importPath - Import path to resolve
   * @param {Object} context - ESLint context
   * @param {Object} tsPaths - TypeScript path mappings
   * @returns {string|null} Resolved path or null if not found
   */
  resolveImportPath(importPath, context, tsPaths) {
    try {
      debug('Resolving import path:', { importPath })
      const currentDir = path.dirname(context.getPhysicalFilename())
      debug('Current directory:', currentDir)

      let basePath
      if (importPath.startsWith(ALIAS_PREFIX)) {
        basePath = this.resolveAliasPath(importPath, tsPaths)
      } else if (importPath.startsWith('.')) {
        basePath = path.resolve(currentDir, importPath)
      }

      if (!basePath) {
        debug('Could not resolve base path:', importPath)
        return null
      }

      const resolvedPath = FileSystem.findFile(basePath)
      if (resolvedPath) {
        debug('Resolved to:', resolvedPath)
        return resolvedPath
      }

      debug('Could not find file:', basePath)
      return null
    } catch (error) {
      debug('resolveImportPath error:', error)
      return null
    }
  },
}

/**
 * Rule checker utilities for validating import rules
 */
const RuleChecker = {
  /**
   * Check if import path matches ignore patterns
   * @param {string} importPath - Import path to check
   * @param {string[]} ignorePatterns - Array of regex patterns to ignore
   * @returns {boolean} True if import path should be ignored
   */
  checkIgnorePatterns(importPath, ignorePatterns) {
    return ignorePatterns.some((pattern) => {
      const regex = new RegExp(pattern)
      return regex.test(importPath)
    })
  },

  /**
   * Check if import from shared directory follows rules
   * @param {string} resolvedPath - Resolved file system path
   * @returns {Object} Result containing isSharedImport and isValid flags
   */
  checkSharedImport(resolvedPath) {
    if (!resolvedPath.includes('/shared/')) {
      return { isSharedImport: false }
    }

    const parts = resolvedPath.split('/')
    const sharedIndex = parts.indexOf('shared')
    // Only allow direct children of shared directory
    const isValid = parts.slice(sharedIndex + 1).length <= 2

    debug('checkSharedImport:', { resolvedPath, parts, sharedIndex, isValid })
    return { isSharedImport: true, isValid }
  },

  /**
   * Check if import follows same-directory rules
   * Allows:
   * 1. Files in the same directory
   * 2. index.tsx from direct child directories
   * @param {string} currentFile - Current file path
   * @param {string} resolvedPath - Resolved import path
   * @returns {boolean} True if import is valid
   */
  checkSameDirectoryImport(currentFile, resolvedPath) {
    const currentDir = path.dirname(currentFile)
    const importDir = path.dirname(resolvedPath)

    // Allow all files in the same directory
    if (currentDir === importDir) {
      return true
    }

    // Only allow index.tsx from direct child directories
    const isValid =
      path.basename(resolvedPath) === INDEX_FILE && currentDir === path.dirname(importDir)

    debug('checkSameDirectoryImport:', {
      currentFile,
      resolvedPath,
      currentDir,
      importDir,
      isSameDir: currentDir === importDir,
      isIndexImport: path.basename(resolvedPath) === INDEX_FILE,
      isValid,
    })
    return isValid
  },
}

// Load TypeScript paths configuration
const tsPaths = FileSystem.loadTsConfig()
debug('Loaded TypeScript paths:', tsPaths)

export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce import path format rules',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignorePatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const currentFile = context.getFilename()

        // Skip if import path matches ignore patterns
        if (RuleChecker.checkIgnorePatterns(importPath, ignorePatterns)) {
          return
        }

        debug('Processing import:', { importPath, currentFile })

        // Only check project-internal imports
        if (!PathUtils.isProjectImport(importPath)) {
          debug('Skipping external import:', importPath)
          return
        }

        // Resolve import path to actual file
        const resolvedPath = PathUtils.resolveImportPath(importPath, context, tsPaths)
        if (!resolvedPath) {
          debug('Could not resolve import path:', importPath)
          return
        }

        // Check shared directory import rules
        const { isSharedImport, isValid: isValidShared } =
          RuleChecker.checkSharedImport(resolvedPath)
        if (isSharedImport) {
          if (!isValidShared) {
            context.report({
              node,
              message: 'Can only import direct children of shared directory',
            })
          }
          return
        }

        // Check same-directory import rules
        const isValidDirectory = RuleChecker.checkSameDirectoryImport(currentFile, resolvedPath)
        if (!isValidDirectory) {
          context.report({
            node,
            message: 'Can only import from same directory',
          })
        }
      },
    }
  },
}
