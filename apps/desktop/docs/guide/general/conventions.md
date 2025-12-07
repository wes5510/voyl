# 코드 컨벤션

## 네이밍 컨벤션

### 파일명

| 유형 | 컨벤션 | 예시 |
|------|--------|------|
| 컴포넌트 | PascalCase | `TreeView.tsx` |
| 훅 | useOOO.ts | `useTreeState.ts` |
| 유틸 | ooo.util.ts | `tree.util.ts` |
| 상수 | ooo.const.ts | `channel.const.ts` |
| 타입 | ooo.type.ts | `node.type.ts` |

### 변수/함수

| 유형 | 컨벤션 | 예시 |
|------|--------|------|
| 변수 | camelCase | `nodeId` |
| 함수 | camelCase | `getNodeById` |
| 상수 (런타임 불변) | UPPER_SNAKE_CASE | `CHANNELS`, `DEFAULT_TIMEOUT` |
| 타입/인터페이스 | PascalCase | `Channel`, `NodeType` |
| Enum 값 | PascalCase | `NodeType.Folder` |

### 상수 vs 변수 구분

```typescript
// ✅ 상수: 런타임에 절대 변하지 않는 값
export const CHANNELS = ['app.sync', ...] as const
export const MAX_RETRY_COUNT = 3

// ✅ 변수: 런타임에 변할 수 있거나 계산되는 값
export const defaultConfig = { ... }
export const channels = getChannels()  // 함수 호출 결과
```
