# React Compiler 도입 - Whiteboard Context

## 목표
React Compiler의 ESLint 플러그인을 프로젝트에 추가하고 설정

## 현재 상태
- React 19.2.0 사용 중 (✅ 호환)
- babel-plugin-react-compiler 1.0.0 이미 설치 및 설정됨
- electron.vite.config.ts에 babel plugin 적용됨 (renderer 프로세스)
- ❌ eslint-plugin-react-compiler 미설치

## 필요 작업
1. eslint-plugin-react-compiler 설치 (devDependencies)
2. apps/desktop/eslint.config.mjs 파일에 플러그인 설정 추가
3. 타입체크 및 린트 검증

## 참조 파일
- `/Users/gihyeonlee/workspace/voyl/apps/desktop/package.json`
- `/Users/gihyeonlee/workspace/voyl/apps/desktop/eslint.config.mjs`
- `/Users/gihyeonlee/workspace/voyl/apps/desktop/electron.vite.config.ts`

## ESLint 설정 가이드
React Compiler ESLint 플러그인은 다음과 같이 설정:
```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  // ... 기존 설정
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

renderer 프로세스 (.tsx 파일)에만 적용하면 됨.
