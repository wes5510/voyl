/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { mockTsConfigPaths, createRuleTester } = require('./utils/test-utils')

// Mock tsconfig paths
mockTsConfigPaths()

const rule = require('./feature-ui-interface-only')
const ruleTester = createRuleTester()

ruleTester.run('feature-ui-interface-only', rule, {
  valid: [
    {
      code: 'import { Component } from "@/features/something/ui/Component"',
      filename: '/src/renderer/src/pages/index.ts',
    },
    {
      code: 'import { Component } from "@/features/something/ui/index"',
      filename: '/src/renderer/src/pages/index.ts',
    },
    {
      code: 'import { Component } from "../features/something/ui/Component"',
      filename: '/src/renderer/src/pages/deep/index.ts',
    },
    {
      code: 'import { Something } from "some-package"',
      filename: '/src/renderer/src/pages/index.ts',
    },
    {
      code: 'import { Something } from "@/styled-system/Button"',
      filename: '/src/renderer/src/pages/index.ts',
      options: [{ ignorePatterns: ['**/styled-system/**'] }],
    },
  ],

  invalid: [
    {
      code: 'import { Sub } from "@/features/something/ui/Component/Sub"',
      filename: '/src/renderer/src/pages/index.ts',
      errors: [
        {
          messageId: 'invalidUiAccess',
          data: { importPath: '@/features/something/ui/Component/Sub' },
        },
      ],
    },
    {
      code: 'import { Component } from "@/features/something/ui/deep/Component"',
      filename: '/src/renderer/src/pages/index.ts',
      errors: [
        {
          messageId: 'invalidUiAccess',
          data: { importPath: '@/features/something/ui/deep/Component' },
        },
      ],
    },
  ],
})
