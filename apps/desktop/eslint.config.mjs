import { fixupConfigRules } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import voylPlugin from '@voyl/eslint-plugin-voyl'
import pluginQuery from '@tanstack/eslint-plugin-query'

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
  ...pluginQuery.configs['flat/recommended'],
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
            '**/src/renderer/page/**',
            '**/src/renderer/model/**',
            '**/src/renderer/repo/**',
            '**/src/renderer/store/**',
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
    files: ['src/renderer/model/**/*.{ts,tsx}'],
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/renderer/model/*/**',
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
    files: ['src/renderer/page/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/renderer/page/**',
            '**/src/renderer/store/*',
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
    files: ['src/renderer/store/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/renderer/store/*/**',
            '**/src/renderer/common/*',
            '**/src/renderer/model/*',
            '**/src/renderer/repo/*',
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
            '**/src/main/model/**',
            '**/src/main/window/**',
            '**/src/main/repo/**',
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
    files: ['src/main/repo/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/main/repo/**',
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
            '**/src/main/model/*/index.js',
            '**/src/main/window/*/*',
            '**/src/common/*',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
        },
      ],
    },
  },
  {
    files: ['src/main/model/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/main/model/*/**',
            '**/src/main/common/*',
            '**/src/main/common/shared/*',
            '**/src/main/db/*/*',
            '**/src/main/repo/*/*',
            '**/src/main/db/index.js',
            '**/src/common/*',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
        },
      ],
    },
  },
  {
    files: ['src/main/window/**/*.{ts,tsx}'],
    plugins: {
      voyl: voylPlugin,
    },
    rules: {
      'voyl/restrict-imports-to-pattern': [
        'error',
        {
          patterns: [
            '**/src/main/window/*/**',
            '**/src/main/common/*',
            '**/src/main/common/shared/*',
            '**/src/main/model/*/index.js',
            '**/src/common/*',
          ],
          tsconfigPath: path.resolve(__dirname, './tsconfig.node.json'),
        },
      ],
    },
  },
]
