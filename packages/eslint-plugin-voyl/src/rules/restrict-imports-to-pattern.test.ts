import { mockTsConfigPaths, createRuleTester } from '../utils/test-utils'

mockTsConfigPaths()

import rule from './restrict-imports-to-pattern'
const ruleTester = createRuleTester()

// @ts-expect-error
ruleTester.run('restrict-imports-to-pattern', rule, {
  valid: [
    {
      code: 'import { Something } from "./Something"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
    },
    {
      code: 'import { Something } from "./Something.js"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/*'] }],
    },
    {
      code: 'import { Something } from "./b/Something.js"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/*/**'] }],
      errors: [{ messageId: 'invalidImport' }],
    },
  ],

  invalid: [
    {
      code: 'import { Something } from "../models/Something"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/**'] }],
      errors: [{ messageId: 'invalidImport' }],
    },
    {
      code: 'import { Something } from "./b/Something.js"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/*'] }],
      errors: [{ messageId: 'invalidImport' }],
    },
    {
      code: 'import { Something } from "./Something.js"',
      filename: '/project/src/pages/index.ts',
      options: [{ patterns: ['**/src/pages/*/**'] }],
      errors: [{ messageId: 'invalidImport' }],
    },
  ],
})
