import { fixupConfigRules } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
const voylPlugin = (await import('./eslint/index.js')).default

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
          project: path.resolve(__dirname, './tsconfig.web.json'),
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.cjs', '.mjs', '.ts', '.tsx', '.d.ts'],
          moduleDirectory: ['node_modules', 'src/renderer/src'],
        },
      },
    },
    rules: {
      '@typescript-eslint/no-non-assertion': 'off',
      'import/no-cycle': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['src/renderer/src/common/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/same-hierarchy-import': [
        'error',
        {
          ignorePatterns: ['@/styled-system/**', '**/common/**'],
        },
      ],
      'voyl/common-isolation': [
        'error',
        {
          ignorePatterns: ['@/styled-system/**'],
        },
      ],
    },
  },
  {
    files: ['src/renderer/src/models/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/same-hierarchy-import': [
        'error',
        {
          ignorePatterns: ['@/styled-system/**', '**/common/**'],
        },
      ],
      'voyl/no-cross-model-imports': ['error'],
      'voyl/no-pages-import': ['error'],
    },
  },
  {
    files: ['src/renderer/src/pages/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/same-hierarchy-import': [
        'error',
        {
          ignorePatterns: ['@/styled-system/**', '**/common/**', '**/models/**'],
        },
      ],
      'voyl/model-store-import-only': ['error'],
    },
  },
]
