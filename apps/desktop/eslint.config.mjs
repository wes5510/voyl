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
          moduleDirectory: ['node_modules', 'src/renderer'],
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
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'voyl/same-level-import': [
        'error',
        {
          patterns: [
            '**/src/renderer/common/**',
            '**/src/renderer/pages/**',
            '**/src/renderer/models/**',
            '**/src/renderer/repos/**',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.web.json'),
        },
      ],
    },
  },
  {
    files: ['src/renderer/common/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: ['**/src/renderer/common/**'],
          tsconfigPath: path.resolve(__dirname, './tsconfig.web.json'),
        },
      ],
    },
  },
  {
    files: ['src/renderer/models/**/*.{ts,tsx}'],
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/renderer/models/*/**',
            '**/src/renderer/common/*',
            '**/src/renderer/common/shared/*',
            '**/src/common/*',
            '**/src/renderer/repos/*',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.web.json'),
        },
      ],
    },
  },
  {
    files: ['src/renderer/pages/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/renderer/pages/**',
            '**/src/renderer/models/*/store',
            '**/src/renderer/common/*',
            '**/src/renderer/common/shared/*',
            '**/src/common/*',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.web.json'),
        },
      ],
    },
  },
  {
    files: ['src/main/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/same-level-import': [
        'error',
        {
          patterns: [
            '**/src/main/common/**',
            '**/src/main/ipc/**',
            '**/src/main/models/**',
            '**/src/main/windows/**',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
        },
      ],
    },
  },
  {
    files: ['src/main/common/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: ['**/src/main/common/**'],
          tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
        },
      ],
    },
  },
  {
    files: ['src/main/db/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/main/db/**',
            '**/src/main/common/*',
            '**/src/main/common/shared/*',
            '**/src/common/*',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
        },
      ],
    },
  },
  {
    files: ['src/main/ipc/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/main/ipc/*',
            '**/src/main/common/*',
            '**/src/main/common/shared/*',
            '**/src/main/models/*/index.js',
            '**/src/main/windows/*/*',
            '**/src/common/*',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
        },
      ],
    },
  },
  {
    files: ['src/main/models/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/main/models/*/**',
            '**/src/main/common/*',
            '**/src/main/common/shared/*',
            '**/src/main/db/*/*',
            '**/src/common/*',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
        },
      ],
    },
  },
  {
    files: ['src/main/windows/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/main/windows/*/**',
            '**/src/main/common/*',
            '**/src/main/common/shared/*',
            '**/src/main/models/*/index.js',
            '**/src/common/*',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
        },
      ],
    },
  },
]
