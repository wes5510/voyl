/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { mockTsConfigPaths, createRuleTester } = require('./utils/test-utils')

// Mock tsconfig paths
mockTsConfigPaths()

const rule = require('./no-pages-import')
const ruleTester = createRuleTester()

ruleTester.run('no-pages-import', rule, {
  valid: [
    // 1. 동일 model 내부 임포트
    {
      code: 'import { useStore } from "@/models/tree/model"',
      filename: '/project/src/models/tree/ui/Component.tsx',
    },
    // 2. 다른 model 임포트 (허용되는 경우)
    {
      code: 'import { Button } from "@/models/common/ui"',
      filename: '/project/src/models/tree/ui/Component.tsx',
    },
    // 3. common 모듈 임포트
    {
      code: 'import { utils } from "@/common/utils"',
      filename: '/project/src/models/tree/ui/Component.tsx',
    },
    // 4. node_modules 임포트
    {
      code: 'import React from "react"',
      filename: '/project/src/models/tree/ui/Component.tsx',
    },
    // 5. pages 외부 파일 임포트 (pages가 아닌 파일에서)
    {
      code: 'import { PageLayout } from "@/components/Layout"',
      filename: '/project/src/pages/index.tsx',
    },
  ],

  invalid: [
    // 1. pages 디렉토리 절대 경로 임포트
    {
      code: 'import HomePage from "@/pages/HomePage"',
      filename: '/project/src/models/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'noPageImport',
          data: { importPath: '@/pages/HomePage' },
        },
      ],
    },
    // 2. pages 하위 경로 임포트
    {
      code: 'import { Layout } from "@/pages/admin/Layout"',
      filename: '/project/src/models/tree/model/store.ts',
      errors: [
        {
          messageId: 'noPageImport',
          data: { importPath: '@/pages/admin/Layout' },
        },
      ],
    },
    // 3. 상대 경로로 pages 임포트
    {
      code: 'import { getData } from "../../pages/api/data"',
      filename: '/project/src/models/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'noPageImport',
          data: { importPath: '../../pages/api/data' },
        },
      ],
    },
    // 4. pages의 TSX 파일 임포트
    {
      code: 'import Dashboard from "@/pages/Dashboard.tsx"',
      filename: '/project/src/models/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'noPageImport',
          data: { importPath: '@/pages/Dashboard.tsx' },
        },
      ],
    },
    // 5. pages의 index 파일 임포트
    {
      code: 'import { loader } from "@/pages/index"',
      filename: '/project/src/models/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'noPageImport',
          data: { importPath: '@/pages/index' },
        },
      ],
    },
  ],
})
