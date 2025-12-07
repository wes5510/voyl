# Web Research: Electron contextBridge Structured Clone 제약 및 우회 패턴

## 조사 목적

Electron `contextBridge.exposeInMainWorld`의 structured clone 제약을 이해하고, 보일러플레이트를 최소화할 수 있는 우회 패턴을 조사.

---

## 1. Structured Clone 제약 상세

### 1.1 왜 Structured Clone을 사용하는가?

`contextBridge.exposeInMainWorld`는 **보안을 위한 Context Isolation**을 유지하면서 Main World와 Isolated World 간에 객체를 전달해야 함.

- **Main World**: Renderer process에서 실행되는 웹 콘텐츠 (신뢰할 수 없음)
- **Isolated World**: Preload script 실행 환경 (신뢰할 수 있음)

이 두 컨텍스트는 완전히 분리되어야 하므로, 객체를 직접 공유할 수 없고 **복제**해야 함.

### 1.2 Structured Clone Algorithm에서 지원하지 않는 타입

출처: MDN Web Docs - Structured Clone Algorithm

| 타입 | 지원 여부 | 이유 |
|------|-----------|------|
| **Function** | ❌ | 함수는 복제할 수 없음 → `DataCloneError` |
| **Proxy** | ❌ | Proxy 객체는 복제 불가 |
| **Symbol** | ❌ | Primitive 중 유일하게 지원 안 됨 |
| **DOM Node** | ❌ | 브라우저 API 객체 |
| **Prototype chain** | ❌ | 프로토타입 체인은 복제되지 않음 |
| **Property descriptors** | ❌ | Getter/Setter, 읽기 전용 속성 등 메타데이터 손실 |
| **Class private fields** | ❌ | 비공개 필드 복제 불가 |

### 1.3 Proxy가 안 되는 구체적 이유

```typescript
// ❌ 실패 케이스 (프로젝트에서 발생한 버그)
const api = new Proxy({} as ChannelApi, {
  get(_, channel: string) {
    return (params: unknown) => ipcRenderer.invoke(channel, params)
  },
})

contextBridge.exposeInMainWorld('api', api)
// Error: An object could not be cloned.
```

**문제:**
1. Proxy는 객체를 감싸는 메타 객체
2. Structured clone은 Proxy의 핸들러(get, set 등)를 복제할 수 없음
3. `exposeInMainWorld`가 Main World로 전달하려고 할 때 실패

**참고:** 프로젝트 내 이전 버그 분석 - `whiteboard/20251207T1200-fix-save-location-error-toast/agent-notes/bug-analyzer-4.md`

---

## 2. 우회 가능한 접근법

### 접근법 1: 명시적 함수 객체 생성 (현재 적용)

**원리:** Proxy 대신 일반 객체에 함수를 속성으로 직접 할당

```typescript
const api: ChannelApi = {
  'app.isInitialized': () => ipcRenderer.invoke('app.isInitialized'),
  'app.initialize': (params) => ipcRenderer.invoke('app.initialize', params),
  // ... 12개 API
}

contextBridge.exposeInMainWorld('api', api) // ✅ 일반 객체는 clone 가능
```

**장점:**
- ✅ 타입 안전성 보장 (TypeScript가 `ChannelApi`와 일치하는지 검증)
- ✅ 명확하고 디버깅 용이
- ✅ Electron 공식 권장 방식
- ✅ 파라미터 유무를 정확히 반영 가능

**단점:**
- ❌ 새 IPC 채널 추가 시 수동으로 추가해야 함
- ❌ 코드가 길어짐 (현재 12개 채널, 28줄)

**평가:** 현재 채널 수(12개)에서는 관리 가능. 공식 권장 방식.

---

### 접근법 2: 코드 생성(Codegen) - 빌드타임 접근

**원리:** `main/ipc/index.ts`의 타입을 파싱하여 `preload/index.ts`를 자동 생성

#### 옵션 2-1: TypeScript Compiler API 사용

```typescript
// scripts/generate-preload.ts
import ts from 'typescript'

// 1. main/ipc/index.ts 파싱
// 2. Handlers 타입에서 채널 목록 추출
// 3. preload/index.ts 생성
```

**장점:**
- ✅ 타입 안전성 유지
- ✅ 새 채널 추가 시 자동 반영
- ✅ 빌드 시 자동 실행 가능

**단점:**
- ❌ TypeScript Compiler API 복잡도
- ❌ 추가 의존성 및 빌드 스크립트 관리
- ❌ 현재 채널 수(12개)에서는 과도한 복잡성

**구현 예시:**
```json
// package.json
{
  "scripts": {
    "prebuild": "tsx scripts/generate-preload.ts",
    "build": "pnpm typecheck && electron-vite build"
  }
}
```

#### 옵션 2-2: ts-morph 활용

```typescript
// scripts/generate-preload.ts
import { Project } from 'ts-morph'

const project = new Project()
const sourceFile = project.addSourceFileAtPath('src/main/ipc/index.ts')

// ChannelApi 타입 파싱
// preload/index.ts 생성
```

**장점:**
- ✅ TypeScript AST 조작이 더 간단 (vs raw TS Compiler API)
- ✅ 타입 정보 유지

**단점:**
- ❌ 추가 의존성 (`ts-morph`)
- ❌ 여전히 스크립트 유지보수 필요

#### 옵션 2-3: 단순 텍스트 파싱

```typescript
// scripts/generate-preload.ts
import fs from 'fs'

const ipcContent = fs.readFileSync('src/main/ipc/index.ts', 'utf-8')
const handlerMatches = ipcContent.matchAll(/'([^']+)':\s*\(/g)
const channels = [...handlerMatches].map(m => m[1])

// preload/index.ts 생성
```

**장점:**
- ✅ 구현 간단
- ✅ 의존성 없음

**단점:**
- ❌ 취약한 파싱 (주석, 포맷 변경에 민감)
- ❌ 타입 정보 손실

**평가:** 채널이 50개 이상으로 증가하면 고려 가능. 현재는 불필요.

---

### 접근법 3: 런타임 객체 생성 (타입 불안전)

**원리:** 채널 목록을 배열로 관리하고, 런타임에 객체 생성

```typescript
// 옵션 3-1: reduce 사용
const channels: ChannelKeys[] = [
  'app.isInitialized',
  'app.initialize',
  // ...
]

const api = channels.reduce((acc, channel) => {
  acc[channel] = (params?: unknown) => ipcRenderer.invoke(channel, params)
  return acc
}, {} as Record<string, unknown>) as ChannelApi

contextBridge.exposeInMainWorld('api', api)
```

```typescript
// 옵션 3-2: Object.fromEntries 사용
const api = Object.fromEntries(
  channels.map(channel => [
    channel,
    (params?: unknown) => ipcRenderer.invoke(channel, params)
  ])
) as ChannelApi
```

**장점:**
- ✅ 채널 목록만 관리하면 됨
- ✅ 코드가 짧아짐

**단점:**
- ❌ 타입 캐스팅으로 안전성 우회 (런타임 검증 없음)
- ❌ 파라미터 유무를 반영할 수 없음 (모든 함수가 `(params?: unknown)`)
- ❌ 여전히 수동으로 채널 목록 관리

**평가:** 타입 안전성을 포기하므로 권장하지 않음.

---

### 접근법 4: TypeScript의 `satisfies` 연산자 활용

**원리:** 타입 캐스팅 대신 `satisfies`로 타입 검증 강화

```typescript
const channelKeys = [
  'app.isInitialized',
  'app.initialize',
  // ...
] as const satisfies readonly ChannelKeys[]

const api = Object.fromEntries(
  channelKeys.map(channel => [
    channel,
    (params?: unknown) => ipcRenderer.invoke(channel, params)
  ])
) satisfies Partial<ChannelApi> as ChannelApi
```

**장점:**
- ✅ `satisfies`로 타입 검증 강화
- ✅ 컴파일 타임에 일부 오류 감지

**단점:**
- ❌ `Partial<ChannelApi>`로 완전한 검증 불가
- ❌ 여전히 파라미터 유무 반영 안 됨

**평가:** 접근법 3보다 낫지만, 접근법 1보다 안전하지 않음.

---

### 접근법 5: Vite Plugin 활용

**원리:** Vite 빌드 시 preload 코드를 자동 생성하는 플러그인 작성

```typescript
// vite-plugin-generate-preload.ts
import type { Plugin } from 'vite'

export function generatePreloadPlugin(): Plugin {
  return {
    name: 'generate-preload',
    buildStart() {
      // main/ipc/index.ts 파싱 → preload/index.ts 생성
    }
  }
}

// electron.vite.config.ts
export default defineConfig({
  preload: {
    plugins: [
      externalizeDepsPlugin(),
      generatePreloadPlugin() // 추가
    ],
  },
})
```

**장점:**
- ✅ 빌드 프로세스에 통합
- ✅ 타입 안전성 유지 가능
- ✅ 자동 갱신

**단점:**
- ❌ 플러그인 작성 및 유지보수 비용
- ❌ electron-vite 특화 (범용성 낮음)
- ❌ 현재 프로젝트 규모에 과도

**평가:** 대규모 프로젝트에서 고려 가능.

---

### 접근법 6: tRPC-Electron

**라이브러리**: `electron-trpc`, `@electron-trpc/toolkit`

**원리:** tRPC를 Electron IPC에 적용

```typescript
// main
const router = t.router({
  getNode: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => getNode(input.id))
})

// renderer (자동 생성된 클라이언트)
const node = await trpc.getNode.query({ id: '123' })
```

**장점:**
- ✅ End-to-end 타입 안전성
- ✅ 클라이언트 API 자동 생성
- ✅ RPC 패러다임

**단점:**
- ❌ tRPC + Zod 학습 필요
- ❌ 기존 IPC 패턴 전면 재작성 필요
- ❌ 작은 프로젝트에 과도한 복잡성

**평가:** 현재 프로젝트에는 부적합. 이미 `ChannelApi` 기반 시스템이 구축됨.

---

## 3. 공식 문서 권장 방식

### Electron 공식 문서

**출처:** `electronjs.org/docs/latest/tutorial/context-isolation`

권장 패턴:
```typescript
// preload.ts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  onReply: (callback: (reply: string) => void) => {
    ipcRenderer.on('reply', (_event, reply) => callback(reply))
  }
})
```

**핵심:**
- ✅ 명시적 함수 객체 생성
- ✅ 타입 안전성 우선
- ✅ 보안을 위한 명확한 API 노출

---

## 4. 비교 분석

| 접근법 | 타입 안전성 | 자동화 | 복잡도 | 현재 적합도 |
|--------|-------------|--------|--------|-------------|
| 1. 명시적 함수 객체 | ⭐⭐⭐⭐⭐ | ❌ | ⭐ | ⭐⭐⭐⭐⭐ |
| 2-1. TS Compiler API Codegen | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| 2-2. ts-morph Codegen | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 2-3. 텍스트 파싱 Codegen | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| 3. 런타임 객체 생성 | ⭐⭐ | ❌ | ⭐ | ⭐ |
| 4. satisfies 활용 | ⭐⭐⭐ | ❌ | ⭐⭐ | ⭐⭐ |
| 5. Vite Plugin | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |
| 6. tRPC-Electron | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ |

---

## 5. 추천

### 현재 (채널 12개)

**접근법 1 (명시적 함수 객체)을 유지**

**이유:**
1. 타입 안전성 최고
2. Electron 공식 권장
3. 코드 명확성
4. 12개 채널은 관리 가능한 수준
5. 추가 의존성/복잡도 없음

### 향후 (채널 50개 이상)

**접근법 2-2 (ts-morph Codegen) 도입 고려**

**이유:**
1. 타입 안전성 유지
2. 자동화로 보일러플레이트 제거
3. TypeScript Compiler API보다 간단
4. 빌드 스크립트로 통합 가능

**구현 예시:**
```json
// package.json
{
  "scripts": {
    "codegen:preload": "tsx scripts/generate-preload.ts",
    "prebuild": "pnpm codegen:preload",
    "build": "pnpm typecheck && electron-vite build"
  },
  "devDependencies": {
    "ts-morph": "^21.0.0"
  }
}
```

---

## 6. 관련 링크

- MDN - Structured Clone Algorithm: `https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm`
- Electron - Context Isolation: `https://www.electronjs.org/docs/latest/tutorial/context-isolation`
- Electron - contextBridge API: `https://www.electronjs.org/docs/latest/api/context-bridge`
- electron-trpc: `https://github.com/jsonnull/electron-trpc`
- ts-morph: `https://github.com/dsherret/ts-morph`

---

## 결론

### Structured Clone 제약:
- Proxy, 함수, Symbol 등 메타 객체/동적 객체는 전달 불가
- 보안(Context Isolation)을 위한 필수 제약
- **우회 불가능. 런타임에 Proxy 사용은 불가능.**

### 현재 최선의 접근:
- 명시적 함수 객체 생성 (접근법 1)
- 12개 채널은 수동 관리 가능
- 타입 안전성 + 공식 권장 방식

### 향후 개선 옵션:
- 채널이 많아지면 (50개+) codegen 도입
- ts-morph 기반 자동 생성 권장
- 빌드 프로세스에 통합

### 권장하지 않는 접근:
- ❌ tRPC-Electron: 전면 재작성 필요
- ❌ Vite Plugin: 과도한 엔지니어링
- ❌ 런타임 객체 생성: 타입 안전성 포기
- ❌ 텍스트 파싱: 취약한 파싱 로직

---

## Needs User Decision

**결정 필요:** 보일러플레이트 제거를 위한 추가 노력의 가치 판단

**옵션:**
1. **현재 패턴 유지** (12개 수동 관리)
   - 장점: 안정적, 명확, 유지보수 간단
   - 단점: 새 채널 추가 시 수동 작업 필요

2. **ts-morph 기반 codegen 도입**
   - 장점: 자동화, 타입 안전성 유지
   - 단점: 초기 구축 비용, 스크립트 유지보수

**권장:** **옵션 1 유지**. 현재 채널 수(12개)에서 codegen 도입은 과도한 엔지니어링. 채널이 50개 이상 증가 시 재검토 권장.
