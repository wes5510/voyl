# window.api 사용 패턴 분석

## 분석 결과

### 1. window.api 사용 파일 (5개)

**Repo 레이어에서만 사용** - 완벽한 캡슐화:

- `/apps/desktop/src/renderer/repo/app.ts` (4회 호출)
- `/apps/desktop/src/renderer/repo/tree.ts` (2회 호출)
- `/apps/desktop/src/renderer/repo/node.ts` (2회 호출)
- `/apps/desktop/src/renderer/repo/treeView.ts` (3회 호출)
- `/apps/desktop/src/renderer/repo/favorite.ts` (1회 호출)

**총 12회 호출**, 렌더러 총 119개 파일 중 5개만 직접 사용.

### 2. 호출 패턴

#### 타입 안전성
- **완전 타입 안전**: `ChannelApi` 타입 기반
- preload에서 `ChannelApi` 정의
- main/ipc에서 `Handlers`로부터 자동 타입 추출
- 채널명 오타 방지: `window.api['app.isInitialized']()` (bracket notation)

#### 에러 핸들링
**2가지 패턴**:

1. **try-catch + 기본값 반환** (읽기 작업):
```typescript
// app.ts - isInitialized
try {
  return await window.api['app.isInitialized']()
} catch (error) {
  console.error('Failed to check initialization status:', error)
  return false  // 기본값 반환
}
```

2. **try-catch + throw** (쓰기 작업):
```typescript
// app.ts - initializeApp
try {
  await window.api['app.initialize'](path)
} catch (error) {
  console.error('Failed to initialize app:', error)
  throw new Error((error as Error).message || 'Failed to initialize app')
}
```

3. **에러 핸들링 없음** (단순 포워딩):
```typescript
// tree.ts, node.ts, treeView.ts, favorite.ts
export const fetchRootNodeId = (): Promise<string> => {
  return window.api['tree.getRootNodeId']()
}
```

### 3. 의존성 구조

```
State 레이어
  ↓ import
Repo 레이어 (window.api 호출)
  ↓ IPC
Main IPC 핸들러
```

**실제 흐름**:
- State 레이어: React Query 사용 (queryOption.ts → repo 함수 import)
- Repo 레이어: `window.api['channel.name']()` 호출
- Main Process: ipcMain.handle로 처리

**예시**:
```typescript
// state/app/queryOption.ts
import { isInitialized } from '@/renderer/repo/app'

export const getInitializationQueryOptions = () => ({
  queryKey: QUERY_KEYS.initialization(),
  queryFn: isInitialized,  // repo 함수 사용
})

// repo/app.ts
export async function isInitialized(): Promise<boolean> {
  try {
    return await window.api['app.isInitialized']()  // IPC 호출
  } catch (error) {
    console.error('Failed to check initialization status:', error)
    return false
  }
}
```

### 4. 타입 시스템

**타입 흐름**:
```
main/ipc/index.ts (Handlers 정의)
  ↓ 타입 추출
main/ipc/index.ts (ChannelApi 타입 생성)
  ↓ re-export
common/channel.type.ts
  ↓ import
preload/index.ts (api 객체에 타입 적용)
  ↓ contextBridge
renderer (window.api 사용)
```

**타입 정의**:
```typescript
// main/ipc/index.ts
const handlers = {
  'app.isInitialized': () => appModel.isInitialized(),
  'app.initialize': (params: { workspaceDirPath: string }) =>
    appModel.initialize(params),
  // ...
}

export type Handlers = typeof handlers

export type ChannelApi = {
  [K in keyof Handlers]: HandlerParams<Handlers[K]> extends never
    ? () => Promise<HandlerResult<Handlers[K]>>
    : (params: HandlerParams<Handlers[K]>) => Promise<HandlerResult<Handlers[K]>>
}
```

### 5. 변경 영향 범위

#### IPC 채널 추가/변경 시
1. **main/ipc/{domain}.ts**: 핸들러 추가
2. **preload/index.ts**: api 객체에 함수 추가
3. **renderer/repo/{domain}.ts**: window.api 호출 래퍼 함수 추가
4. **renderer/state/{domain}/**: 필요 시 React Query 옵션 추가

**타입은 자동 전파** - `ChannelApi` 타입이 handlers로부터 자동 생성되므로 타입 정의만 추가하면 됨.

#### 보일러플레이트
**현재 필요한 작업**:
- 3곳에서 수동 코드 작성 (main handler + preload api + renderer repo)
- preload의 api 객체는 명시적 함수 나열 (Proxy 사용 불가 - structured clone 제약)

**구조적 이슈**:
- preload/index.ts의 api 객체가 handlers와 동기화 필요
- 채널 추가 시마다 preload에 수동 추가해야 함

## 주요 발견

### 장점
1. **완벽한 레이어 분리**: Repo 레이어만 window.api 직접 호출
2. **타입 안전성**: `ChannelApi` 타입으로 컴파일 타임 검증
3. **일관된 패턴**: 모든 IPC 호출이 동일한 구조

### 개선 가능 영역
1. **보일러플레이트**: preload api 객체 수동 동기화
2. **에러 핸들링 불일치**: repo 레이어에서 일부만 try-catch 적용
3. **타입 중복 정의**: handlers 타입과 api 객체 구조 수동 매핑

## 권장 사항

변경 영향 범위가 제한적이므로 (5개 파일만 직접 사용) 구조 개선이 안전함. 단, preload의 structured clone 제약은 Electron의 근본적 한계이므로 완전 자동화는 어려울 수 있음.
