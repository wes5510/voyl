import { mockTsConfigPaths, createRuleTester } from '../utils/test-utils'

mockTsConfigPaths()

import rule from './common-isolation'
const ruleTester = createRuleTester()

// @ts-expect-error
ruleTester.run('common-isolation', rule, {
  valid: [
    // 1. Import from node_modules
    {
      code: 'import { useState } from "react"',
      filename: '/project/src/common/components/Button.ts',
    },

    // 2. Import from common directory - relative path
    {
      code: 'import { utils } from "./utils"',
      filename: '/project/src/common/components/Button.ts',
    },
    {
      code: 'import { Button } from "../components/Button"',
      filename: '/project/src/common/utils/index.ts',
    },

    // 3. Import from common directory - absolute path
    {
      code: 'import { utils } from "@/common/utils"',
      filename: '/project/src/common/components/Button.ts',
    },

    // 4. Import from non-common file (should be ignored)
    {
      code: 'import { Something } from "@/models/something"',
      filename: '/project/src/models/other/index.ts',
    },

    // 5. Import from ignored patterns
    {
      code: 'import { Something } from "@/models/something"',
      filename: '/project/src/common/utils.ts',
      options: [{ ignorePatterns: ['**/models/something'] }],
    },
  ],

  invalid: [
    // 1. Import from models directory - absolute path
    {
      code: 'import { Something } from "@/models/something"',
      filename: '/project/src/common/utils.ts',
      errors: [
        {
          messageId: 'invalidAccess',
          data: { importPath: '@/models/something' },
        },
      ],
    },

    // 2. Import from models directory - relative path
    {
      code: 'import { Something } from "../../models/something"',
      filename: '/project/src/common/utils.ts',
      errors: [
        {
          messageId: 'invalidAccess',
          data: { importPath: '../../models/something' },
        },
      ],
    },

    // 3. Import from pages directory - absolute path
    {
      code: 'import { Something } from "@/pages/something"',
      filename: '/project/src/common/utils.ts',
      errors: [
        {
          messageId: 'invalidAccess',
          data: { importPath: '@/pages/something' },
        },
      ],
    },

    // 4. Import from pages directory - relative path
    {
      code: 'import { Something } from "../../pages/something"',
      filename: '/project/src/common/utils.ts',
      errors: [
        {
          messageId: 'invalidAccess',
          data: { importPath: '../../pages/something' },
        },
      ],
    },
  ],
})
