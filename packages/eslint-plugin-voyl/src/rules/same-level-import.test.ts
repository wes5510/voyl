import { mockTsConfigPaths, createRuleTester } from '../utils/test-utils'

mockTsConfigPaths()

import rule from './same-level-import'
const ruleTester = createRuleTester()

// @ts-expect-error
ruleTester.run('same-level-import', rule, {
  valid: [
    // 1. Import from same directory
    {
      code: 'import { Something } from "./Something"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },
    {
      code: 'import { Something } from "@/pages/Something"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },
    {
      code: 'import { Something } from "../Something"',
      filename: '/project/src/pages/A/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },
    {
      code: 'import { Something } from "./index"',
      filename: '/project/src/pages/A/store.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },
    {
      code: 'import { Something } from "./b/index.js"',
      filename: '/project/src/pages/A/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },

    // 2. Import from shared directory
    {
      code: 'import { Something } from "./shared/Button"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },
    {
      code: 'import { Something } from "../shared/Button"',
      filename: '/project/src/pages/something/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },
    {
      code: 'import { Something } from "../../shared/Button"',
      filename: '/project/src/pages/deep/something/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },
    {
      code: 'import Icon from "./Icon"',
      filename: '/project/src/pages/shared/Button.tsx',
      options: [{ patterns: ['**/src/pages/**'] }],
    },

    // 3. Import from node_modules
    {
      code: 'import { Something } from "some-package"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },
  ],

  invalid: [
    // 1. Import from deep nested path (except shared)
    {
      code: 'import { Something } from "./deep/Something"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
      errors: [{ messageId: 'invalidImport' }],
    },
    {
      code: 'import { Something } from "@/pages/deep/Something"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
      errors: [{ messageId: 'invalidImport' }],
    },

    // 2. Import from deep nested path in shared directory
    {
      code: 'import { Something } from "./shared/deep/Button"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
      errors: [{ messageId: 'invalidSharedImport' }],
    },
    {
      code: 'import { Something } from "../shared/deep/Button"',
      filename: '/project/src/pages/something/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
      errors: [{ messageId: 'invalidSharedImport' }],
    },
  ],
})
