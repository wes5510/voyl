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
          ignorePatterns: ['@/styled-system/**', '**/features/**', '**/common/**'],
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
    files: ['src/renderer/src/features/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/no-cross-feature-imports': ['error'],
      'voyl/no-pages-import': ['error'],
    },
  },
  {
    files: ['src/renderer/src/features/*/ui/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/same-hierarchy-import': [
        'error',
        {
          ignorePatterns: ['@/styled-system/**', '**/features/*/model/**', '**/common/**'],
        },
      ],
      'voyl/feature-model-index-import-only': ['error'],
    },
  },
  {
    files: ['src/renderer/src/features/*/model/**/*.{ts,tsx}'],
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
          ignorePatterns: [
            '@/styled-system/**',
            '**/common/**',
            '**/features/*/ui/**',
            '**/models/**',
          ],
        },
      ],
      'voyl/feature-ui-interface-only': ['error'],
      'voyl/feature-model-index-import-only': ['error'],
    },
  },
]
