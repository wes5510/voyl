import { fixupConfigRules } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import voylPlugin from '@voyl/eslint-plugin-voyl'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['**/node_modules', '**/dist', '**/out', '**/.gitignore'],
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
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      '@typescript-eslint/no-non-assertion': 'off',
      'import/no-cycle': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'voyl/same-level-import': [
        'error',
        {
          patterns: [
            '**/renderer/src/common/**',
            '**/renderer/src/pages/**',
            '**/renderer/src/models/**',
          ],
        },
      ],
    },
  },
  {
    files: ['src/renderer/src/common/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/common-isolation': ['error'],
    },
  },
  {
    files: ['src/renderer/src/models/**/*.{ts,tsx}'],
    rules: {
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
      'voyl/model-store-import-only': ['error'],
    },
  },
]
