# 1.1.2 계층적 초기화 로직 아키텍처 재설계 - 실행 로그

**실행일**: 2025-01-20  
**모드**: ACT  
**작업**: 1.1.2-workspace-initialization.md 계획서를 계층적 구조에 맞게 재작성

## 🎯 수행 작업

### **1. 계획서 완전 재설계**

**대상 파일**: `docs/planning/20250720-infrastructure-layer/1.1.2-workspace-initialization.md`

**주요 변경사항**:

#### **제목 및 목표 변경**

```diff
- # 1.1.2 워크스페이스 초기화 로직 구현
+ # 1.1.2 계층적 초기화 로직 구현

- 사용자가 지정한 워크스페이스 경로에 필요한 폴더 구조와 설정 파일을 생성하는 초기화 로직을 구현합니다.
+ 앱과 워크스페이스의 계층적 구조를 기반으로 초기화 로직을 구현합니다. 앱 레벨에서 전체 초기화를 조정하고, 워크스페이스 레벨에서 세부 초기화를 담당하여 안정적인 초기화를 보장합니다.
```

#### **완료 기준 업데이트**

```diff
- [x] 최상위 초기화 함수 구현
- [x] 워크스페이스 초기화 조정자 구현
- [x] 개별 초기화 함수들 구현
- [x] 에러 처리 및 복구 로직
- [x] 단위 테스트 작성

+ [x] 앱 레벨 초기화 함수 구현 (models/app/index.ts)
+ [x] 워크스페이스 초기화 로직 구현 (models/app/workspace/index.ts)
+ [x] 계층적 에러 처리 및 복구 로직
+ [x] ESLint 규칙 준수하는 구조
+ [x] 크로스 플랫폼 호환 테스트 작성
```

### **2. 파일 위치 재설계**

#### **기존 구조의 문제점**

- `common/paths/workspace.ts`: 경로 관리와 초기화 로직 혼재
- `models/workspace/index.ts`: 워크스페이스만 분리되어 앱과 연결점 모호
- ESLint 규칙 위반 가능성

#### **새로운 계층적 구조**

```diff
- src/main/common/paths/workspace.ts          # initializeApp
- src/main/models/workspace/index.ts          # initializeWorkspace

+ src/main/models/app/index.ts                # initializeApp + 앱 함수들 통합
+ src/main/models/app/workspace/index.ts      # initializeWorkspace + 워크스페이스 함수들 통합
```

### **3. Import 경로 수정**

#### **ESLint 규칙 준수**

```diff
- import { hasConfig, getConfigPath } from './index.js'
- import { initializeWorkspace } from '../../models/workspace/index.js'

+ import { loadAppConfig, getCachePath } from '../index.js'  // ✅ 같은 model 내 import
+ import { WORKSPACE_PATHS } from './const.js'
```

#### **함수명 통일**

```diff
- const config = await loadConfig()           # 정의되지 않은 함수
+ const config = await loadAppConfig()        # 1.1.1에서 정의된 함수
```

### **4. 상수 참조 수정**

#### **올바른 상수 사용**

```diff
- PATHS.WORKSPACE.SETTINGS_FILE
- PATHS.WORKSPACE.NODES_DIR
- PATHS.WORKSPACE.CONTENT_DIR
- PATHS.WORKSPACE.LOG_DIR

+ WORKSPACE_PATHS.SETTINGS_FILE
+ WORKSPACE_PATHS.NODES_DIR
+ WORKSPACE_PATHS.CONTENT_DIR
+ WORKSPACE_PATHS.LOG_DIR
```

### **5. 테스트 개선**

#### **크로스 플랫폼 호환성**

```diff
- const testWorkspacePath = '/tmp/test-workspace'     # Unix만 지원

+ import { tmpdir } from 'os'
+ import { join } from 'path'
+ const testWorkspacePath = join(tmpdir(), 'test-workspace')  # 크로스 플랫폼
```

#### **계층적 테스트 구조**

- `src/main/models/app/index.test.ts`: 앱 초기화 테스트
- `src/main/models/app/workspace/index.test.ts`: 워크스페이스 초기화 테스트

### **6. 파일 구조 단순화**

#### **불필요한 파일 제거**

```diff
- src/main/models/workspace/types.ts          # 제거
- src/main/models/workspace/utils.ts          # 제거

+ models/app/workspace/index.ts에 모든 함수 통합
```

## ✅ 완료된 작업

- [x] 제목 및 목표를 계층적 구조로 재정의
- [x] 완료 기준을 새 아키텍처에 맞게 업데이트
- [x] 파일 위치를 계층적 구조로 변경
- [x] Import 경로를 ESLint 규칙 준수하도록 수정
- [x] 함수명 통일 (`loadConfig` → `loadAppConfig`)
- [x] 상수 참조를 올바른 네이밍으로 수정
- [x] 파일 구조를 단순화된 2파일 구조로 업데이트
- [x] 테스트를 크로스 플랫폼 호환으로 개선
- [x] 계층적 테스트 구조 도입
- [x] 함수 가시성 조정 (내부 함수들 private 처리)

## 🎯 아키텍처 개선 효과

### **1. 계층적 구조 완성**

- **앱 레벨**: 전체 초기화 조정, 앱 설정 관리
- **워크스페이스 레벨**: 워크스페이스 내부 구조 초기화
- **명확한 책임 분리**: 각 레벨이 자신의 영역만 담당

### **2. ESLint 규칙 완전 준수**

- 같은 model 내에서만 import
- `voyl/restrict-imports-to-pattern` 규칙 준수
- 순환 의존성 방지

### **3. 파일 구조 단순화**

- 각 레벨에서 const.ts + index.ts만 사용
- 불필요한 types.ts, utils.ts 제거
- 함수 구현과 인터페이스 통합

### **4. 크로스 플랫폼 호환성**

- `tmpdir()` 사용으로 Windows/macOS/Linux 지원
- 플랫폼별 경로 구분자 자동 처리

### **5. 유지보수성 향상**

- 함수 찾기 위치 명확화 (항상 index.ts)
- 계층별 독립적 개발 가능
- 테스트 격리 개선

## 🔄 다음 단계

1. **1.1.3 IPC 핸들러** 계획서도 새 구조에 맞게 수정
2. **기존 코드 마이그레이션** 단계별 진행
3. **통합 테스트** 계층 간 상호작용 검증

---

## 📝 추가 업데이트: initCacheDB 최종 설계

### 문제 발견

- `initCacheDB`가 워크스페이스 초기화에 포함되어 있었으나, 앱 레벨 작업임을 확인
- 캐시 DB의 실제 목적: **다중 기기 동기화** 대응

### 최종 결정

```typescript
// models/app/index.ts
export async function initializeApp(): Promise<void> {
  // 1. 설정 확인
  // 2. 워크스페이스 초기화
  await initializeWorkspace(config.workspacePath)

  // 3. 캐시 DB 매번 초기화 (다중 기기 동기화)
  await initCacheDB(config.workspacePath)
}

// 핵심 로직: 기존 cache.db 삭제 → 재생성 → JSON 스캔 → 캐시 로드
```

### 설계 근거

- **다중 기기 문제**: 다른 기기에서 JSON 수정 → 클라우드 동기화 → 현재 기기 cache.db는 구버전
- **성능 최적화**: Diff 계산보다 전체 재생성이 더 빠름
- **단순성**: 복잡한 동기화 로직 불필요

### 추가 수정: 캐시 DB 저장 위치

```typescript
// ❌ 기존: userData (영구 데이터 영역)
app.getPath('userData') + '/cache.db'

// ✅ 수정: cache (캐시 전용 영역)
app.getPath('cache') + '/cache.db'
```

- **근거**: 매번 초기화되는 임시 캐시 데이터는 캐시 디렉터리가 적절

### 추가 수정: initCacheDB 위치 재배치 및 디렉터리 생성

- **문제 1**: `initCacheDB`가 워크스페이스 초기화 섹션에 있었으나, 앱 레벨에서 호출됨
- **해결 1**: `initCacheDB`를 앱 초기화 섹션으로 이동
- **근거**: 캐시 DB는 앱 전역 리소스이며, 여러 워크스페이스와 독립적

- **문제 2**: 캐시 디렉터리 생성 로직이 불필요함을 발견
- **해결 2**: `fs.ensureDir(cacheDir)` 제거
- **근거**: `app.getPath('cache')`는 Electron이 보장하는 기존 디렉터리이며, 직접 파일 생성 가능

- **문제 3**: models에서 DB 내부 구현을 직접 조작하는 것은 아키텍처 위반
- **해결 3**: `initCacheDB` 로직을 db 모듈로 이동, models에서는 위임만
- **근거**: models는 db와 common만 import 가능하며, DB 로직은 db에서 캡슐화

- **문제 4**: 전체 초기화 조정이 models에 있어서 아키텍처상 부적절
- **해결 4**: 초기화 조정 로직을 main/index.ts로 이동
- **근거**: 엔트리 포인트에서 전체 초기화를 조정하고, models는 순수 비즈니스 로직만 담당

- **문제 5**: main에서 appModel의 내부 구현(config 객체, workspacePath 추출)에 의존
- **해결 5**: `initialize()` 함수로 설정 로드와 워크스페이스 초기화를 캡슐화
- **근거**: main은 고수준 API만 호출하고, 내부 구현은 완전히 캡슐화, 함수명도 간결하게 개선

- **문제 6**: DB 초기화 함수명이 `initializeCache`로 구체적 구현 노출
- **해결 6**: `db.initialize()`로 변경하여 일관성 확보
- **근거**: 모든 모듈이 `initialize()` 패턴으로 통일, 내부 구현(캐시) 숨김

- **문제 7**: DB 초기화에 대한 구체적 구현 계획 부족
- **해결 7**: `db/index.ts` 상세 구현 계획 추가 (DB 재생성, 스키마 생성, 데이터 로드)
- **근거**: connect.ts 대체 및 다중 기기 동기화 요구사항 충족

- **문제 8**: DB 모듈이 models/app에 의존하는 아키텍처 위반
- **해결 8**: DB 초기화를 `initialize({ workspacePath, cachePath })` 형태로 변경, 모든 경로를 인자로 받음
- **근거**: DB는 완전히 독립적이어야 하며, ESLint 규칙(db는 common만 import) 준수

- **문제 9**: `createSchema`와 `loadWorkspaceData` 함수의 구체적 구현 방향 불분명
- **해결 9**:
  - `createSchema`: 기존 스키마 파일 import 후 CREATE TABLE 직접 실행 (의존성 순서 준수)
  - `loadWorkspaceData`: settings.json과 nodes/ 디렉터리 분리 처리, prepared statement 활용
- **근거**: 워크스페이스 데이터 구조(PRD) 반영, 성능 및 에러 처리 최적화

- **문제 10**: 사용자 문의로 drizzle-orm 자동 스키마 생성 기능 검토 필요
- **해결 10**:
  - `drizzle-kit push` 기능 확인 및 장단점 분석
  - 개발 시에는 `drizzle-kit push` 권장, 런타임 cache DB에는 현재 방식 유지
  - 두 방법의 사용 시나리오 명확화
- **근거**: drizzle-kit push는 CLI 도구로 런타임 사용 불가, cache DB는 매번 재생성되므로 런타임 방식이 적합

- **문제 11**: 사용자 지적으로 수동 CREATE TABLE 방식의 유지보수성 문제 인식
- **해결 11**:
  - **Drizzle migrate 함수 확정**: `migrate(db, { migrationsFolder })` 사용
  - 복잡한 자동 스캔, fallback 방식 모두 제거
  - 개발: `npx drizzle-kit generate`, 런타임: migrate 함수 실행
- **근거**: Drizzle 공식 표준 방법이며, production에서 검증된 방식. 새 스키마 추가 시 코드 수정 불필요

---

**실행 완료**: 2025-01-20  
**소요 시간**: 약 45분  
**상태**: ✅ 완료
