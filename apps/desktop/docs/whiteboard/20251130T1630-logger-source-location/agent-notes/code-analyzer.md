# Logger 코드 분석 결과

## 1. Logger 정의 위치

**파일**: `/apps/desktop/src/main/common/logger.util.ts`

```typescript
import pino from 'pino'

export const logger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
})
```

## 2. Logger 구조 및 API

### 라이브러리
- **pino**: 고성능 Node.js 로거
- **pino-pretty**: 개발 환경 전용 포맷터 (colorize, 시간 포맷팅)

### 설정
- **개발 환경**: debug 레벨, pino-pretty transport
- **프로덕션**: info 레벨, 기본 JSON 출력

### API
표준 pino API 사용:
- `logger.debug(obj, msg)` - 디버그 로그
- `logger.info(obj, msg)` - 정보 로그
- `logger.warn(obj, msg)` - 경고 로그
- `logger.error(obj, msg)` - 에러 로그
- `logger.fatal(obj, msg)` - 치명적 에러 로그

형식: `logger.level({ contextObject }, 'message')`

## 3. 사용 패턴 분석

### 총 7개 호출 지점 발견

#### 3.1 전역 에러 핸들링 (apps/desktop/src/main/index.ts)
```typescript
// 라인 8
process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'Uncaught Exception')
})

// 라인 12
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled Promise Rejection')
})
```

#### 3.2 개발 도구 설치 (apps/desktop/src/main/index.ts)
```typescript
// 라인 32
logger.debug({ extensionName }, 'Added Extension')

// 라인 34
logger.error({ err }, 'Failed to install React DevTools')

// 라인 47
ipcMain.on('ping', () => logger.debug('pong'))
```

#### 3.3 SQL 쿼리 로깅 (apps/desktop/src/main/repo/shared/db.ts)
```typescript
// 라인 16
const drizzleLogger = {
  logQuery(query: string, params: unknown[]): void {
    logger.debug({ query, params }, 'SQL Query')
  },
}
```

#### 3.4 비즈니스 로직 (apps/desktop/src/main/model/treeView/index.ts)
```typescript
// 라인 136
export async function removeNode({ nodeId }: { nodeId: string }): Promise<Node> {
  logger.debug({ nodeId }, 'Remove Node')
  // ...
}
```

### 사용 패턴 요약
1. **Context + Message 패턴**: `logger.level({ context }, 'message')` (주류)
2. **Message Only 패턴**: `logger.level('message')` (1건)
3. **사용 범위**: Main process 전역 (repo, model, 루트)
4. **주 용도**: 에러 추적, SQL 디버깅, 비즈니스 로직 추적

## 4. 파일명/라인 번호 추가 방안

### 4.1 수정 대상
**파일**: `/apps/desktop/src/main/common/logger.util.ts`

### 4.2 구현 방안

#### Option 1: Pino Custom Mixin (권장)
```typescript
export const logger = pino({
  // 기존 설정 유지
  mixin() {
    const stack = new Error().stack
    const caller = stack?.split('\n')[3] // 호출자 위치
    const match = caller?.match(/\((.+):(\d+):(\d+)\)/)
    return match ? { 
      file: match[1], 
      line: match[2] 
    } : {}
  }
})
```

**장점**: 
- 기존 호출 코드 변경 불필요
- pino 네이티브 기능 활용
- pino-pretty와 자동 통합

**단점**: 
- 모든 로그에 stack trace 오버헤드 (개발 환경만 적용 가능)

#### Option 2: Wrapper 함수
```typescript
function createLoggerWithLocation() {
  const getLocation = () => {
    const stack = new Error().stack
    // location 추출 로직
  }
  
  return {
    debug: (obj, msg) => logger.debug({ ...obj, ...getLocation() }, msg),
    info: (obj, msg) => logger.info({ ...obj, ...getLocation() }, msg),
    // ...
  }
}

export const logger = createLoggerWithLocation()
```

**장점**: 
- 유연한 커스터마이징
- 조건부 활성화 용이

**단점**: 
- TypeScript 타입 정의 복잡
- pino API 전체 래핑 필요

### 4.3 Stack Trace 파싱 고려사항

V8 Stack Trace 형식:
```
Error
    at Object.<anonymous> (/path/to/file.js:10:15)
    at Module._compile (internal/modules/cjs/loader.js:...)
```

파싱 로직:
1. `new Error().stack` 생성
2. Stack의 3~4번째 라인 파싱 (wrapper 깊이에 따라 조정)
3. 파일 경로, 라인 번호 추출
4. 프로젝트 루트 기준 상대 경로 변환

### 4.4 성능 최적화

```typescript
const shouldIncludeLocation = process.env.NODE_ENV === 'development'

mixin() {
  if (!shouldIncludeLocation) return {}
  // location 추출 로직
}
```

프로덕션 빌드에서는 비활성화하여 오버헤드 제거

## 5. 추천 구현 순서

1. **mixin 기반 구현** (logger.util.ts 수정)
2. **개발 환경에서만 활성화** (성능 고려)
3. **pino-pretty 포맷 커스터마이징** (출력 형식 조정)
4. **기존 로그 확인** (모든 호출 지점에서 정상 동작 검증)

## 6. 영향 범위

**직접 수정**: 
- `/apps/desktop/src/main/common/logger.util.ts` (1개 파일)

**간접 영향** (기존 코드 변경 불필요):
- `/apps/desktop/src/main/index.ts`
- `/apps/desktop/src/main/repo/shared/db.ts`
- `/apps/desktop/src/main/model/treeView/index.ts`

**의존성 추가**: 
- 없음 (pino 기본 기능 활용)

## 7. 참고 자료

- [Pino Mixin 문서](https://getpino.io/#/docs/api?id=mixin-function)
- [V8 Stack Trace API](https://v8.dev/docs/stack-trace-api)
- [Pino Pretty 커스터마이징](https://github.com/pinojs/pino-pretty#customization)
