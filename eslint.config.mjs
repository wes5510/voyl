import { fixupConfigRules } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['**/node_modules', '**/dist', '**/out', '**/.gitignore', '**/styled-system'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      '@electron-toolkit/eslint-config-ts/recommended',
      '@electron-toolkit/eslint-config-prettier',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
    ),
  ),
  {
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.web.json', './tsconfig.node.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.cjs', '.mjs', '.ts', '.tsx', '.d.ts'],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      'import/no-cycle': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/renderer/src/state',
              from: './',
              except: [
                './src/renderer/src/state',
                './src/renderer/src/model',
                './src/renderer/src/api',
                './src/renderer/src/component',
                './node_modules',
              ],
              message: 'Only import from model, api and component in state directory.',
            },
            {
              target: './src/renderer/src/component',
              from: ['./src/renderer/src/api', './src/renderer/src/model'],
              message: 'Do not import from api and model in component directory.',
            },
            {
              target: './src/renderer/src/ui',
              from: ['./src/renderer/src/api', './src/renderer/src/model'],
              message: 'Do not import from api and model in ui directory.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/renderer/src/ui/**/*'],
    ignores: ['**/index.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?!.*component)(../).*',
              message: 'Do not import from parent components',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/renderer/src/ui/**/index.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^((\\.\\.\\/){2,})(?!component\\/).*',
              message: 'Do not import from higher-level directories in index files',
            },
          ],
        },
      ],
    },
  },
]
