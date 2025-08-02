# 1.1.1 계층적 경로 관리 아키텍처 재설계 - 실행 로그

**실행일**: 2025-01-20  
**모드**: ACT  
**작업**: 1.1.1-path-utilities.md 계획서 ESLint 규칙 준수 구조로 재작성

## 🎯 수행 작업

### **1. 계획서 완전 재설계**

**대상 파일**: `docs/planning/20250720-infrastructure-layer/1.1.1-path-utilities.md`

**주요 변경사항**:

#### **아키텍처 변경**

- **기존**: `common/paths` 중심의 통합 관리
- **변경**: `models/app` + `models/workspace` 도메인 분리

#### **파일 구조 변경**

```diff
- src/main/common/paths/
-   ├── const.ts          # 통합 상수
-   ├── index.ts          # 5개 함수
-   └── README.md

+ src/main/models/app/
+   ├── const.ts          # 앱 레벨 상수
+   ├── paths.ts          # 앱 경로 함수
+   ├── index.ts          # 🆕 통합 인터페이스 (모든 함수 export)
+   └── workspace/        # 🆕 하위 모델 (ESLint 규칙 준수)
+       ├── const.ts      # 워크스페이스 상수
+       ├── paths.ts      # 워크스페이스 경로 함수
+       └── index.ts      # 워크스페이스 초기화
```

#### **ESLint 규칙 준수 개선**

- **문제**: `models/workspace`에서 `models/app` 직접 import 시 `voyl/restrict-imports-to-pattern` 위반
- **해결**: 워크스페이스를 앱의 하위 모델로 구성 (`models/app/workspace/`)
- **결과**: `../paths.js` 형태의 같은 model 내 import만 사용하여 규칙 준수

#### **상수 캡슐화**

- **기존**: 모든 상수를 `PATHS` 객체에 통합
- **변경**: 도메인별 상수 분리, 외부 직접 접근 차단

#### **함수 책임 분리**

- **앱 도메인**: `getConfigPath()`, `getCachePath()`, `hasConfig()`, `loadAppConfig()`
- **워크스페이스 도메인**: `getWorkspacePath()`, `getNodesPath()`, `getContentPath()`, `getLogPath()`, `getWorkspaceSettingsPath()`

#### **비동기 설계**

- **앱 경로**: 동기 함수 (직접 계산)
- **워크스페이스 경로**: 비동기 함수 (설정 파일 로드 필요)

### **2. 테스트 전략 개선**

**도메인별 독립 테스트**:

- `src/main/models/app/paths.test.ts` - 앱 도메인 테스트
- `src/main/models/workspace/paths.test.ts` - 워크스페이스 도메인 테스트

**Mock을 통한 의존성 격리**:

- 워크스페이스 테스트에서 앱 설정 로드 Mock
- 각 도메인 독립적 검증

### **3. connect.ts 마이그레이션 계획**

**Import 경로 변경**:

```diff
- import { getCachePath } from '../common/paths/index.js'
+ import { getCachePath } from '../models/app/paths.js'
```

## ✅ 완료된 작업

- [x] 계획서 목표 및 완료 기준 재정의
- [x] 도메인별 구현 태스크 재작성
- [x] 앱 도메인 상수 및 함수 설계
- [x] 워크스페이스 도메인 상수 및 함수 설계
- [x] connect.ts 전환 계획 업데이트
- [x] 파일 구조 재설계
- [x] 도메인별 테스트 계획 수립
- [x] 구현 세부사항 업데이트
- [x] 다음 단계 연결 재정의
- [x] 주의사항 업데이트

## 🎯 아키텍처 개선 효과

### **1. 계층적 구조 도입**

- 앱을 최상위 도메인으로, 워크스페이스를 하위 모델로 구성
- ESLint 규칙 완전 준수 (같은 model 내에서만 import)
- 단일 책임 원칙 준수
- 향후 확장성 향상 (plugin, theme 등 추가 가능)

### **2. 통제된 인터페이스**

- `models/app/index.ts`에서 모든 함수 통합 export
- 외부에서는 하위 모듈 직접 접근 금지
- 캡슐화 강화: 각 레벨의 상수 외부 접근 차단
- 구현 세부사항 은닉

### **3. ESLint 규칙 준수**

- `voyl/restrict-imports-to-pattern` 완전 준수
- workspace → app (상위 접근만 허용)
- 순환 의존성 방지
- 테스트 격리 개선

### **4. 유지보수성 향상**

- 변경 영향 범위 제한
- 계층별 독립적 개발 가능
- 코드 가독성 향상
- ESLint 규칙 위반 방지

## 🔄 다음 단계

1. **1.1.2 워크스페이스 초기화** 계획서를 계층적 구조에 맞게 수정
2. **models/app** 중심의 앱 초기화 로직 재설계
3. **통합 인터페이스** 사용으로 기존 코드 마이그레이션
4. **ESLint 규칙 준수** 검증 및 적용

---

## 📝 추가 개선 작업 (2차)

### **계층적 인터페이스 구조 개선**

**문제 발견**:

- `models/app/index.ts`에서 `./workspace/paths.js` 직접 접근
- 계층별 인터페이스 일관성 부족, 캡슐화 원칙 위반

**해결 방법**:

```diff
// models/app/index.ts
- export { getWorkspacePath, ... } from './workspace/paths.js'  // 직접 접근
+ export * from './workspace/index.js'  // 인터페이스를 통한 접근
```

**추가된 구조**:

- `models/app/workspace/index.ts`: 워크스페이스 통합 인터페이스
- 각 레벨에서 자신의 `index.js` 인터페이스 제공
- `export *`를 통한 깔끔한 재export

### **업데이트된 테스트 계획**

- 워크스페이스 통합 인터페이스 테스트 추가
- 계층 간 인터페이스 일관성 검증
- 앱 통합 인터페이스 테스트 개선

## 📝 최종 구조 단순화 (3차)

### **paths.ts 파일 제거**

**개선 제안**:

- 불필요한 중간 파일(`paths.ts`) 제거
- `index.ts`에서 함수 구현과 인터페이스 통합

**변경 내용**:

```diff
// 기존 3파일 구조
- models/app/const.ts
- models/app/paths.ts      # 제거됨
- models/app/index.ts

// 단순화된 2파일 구조
+ models/app/const.ts
+ models/app/index.ts      # 함수 구현 + 인터페이스 통합
```

**적용 범위**:

- `models/app/paths.ts` → `models/app/index.ts` 통합
- `models/app/workspace/paths.ts` → `models/app/workspace/index.ts` 통합
- 모든 테스트 파일에서 import 경로 수정

### **최종 효과**

- 파일 개수 33% 감소 (6개 → 4개)
- 함수 찾기 및 수정 위치 명확화
- 유지보수성 향상

---

## 📝 추가 업데이트: 캐시 DB 저장 위치 수정

### 문제 발견

- 캐시 DB를 `userData`에 저장하고 있었으나, 이는 영구 데이터 영역
- 매번 초기화되는 캐시 데이터에는 부적절한 위치

### 수정사항

```typescript
// ❌ 기존 (부적절)
app.getPath('userData') + '/cache.db' // 영구 데이터 영역
// ~/Library/Application Support/voyl/cache.db

// ✅ 수정 (적절)
app.getPath('cache') + '/cache.db' // 캐시 전용 영역
// ~/Library/Caches/voyl/cache.db
```

### 근거

- **데이터 특성**: 매번 초기화되는 임시적 캐시 데이터
- **운영체제 정책**: 캐시 디렉터리는 시스템이 자동 정리 가능
- **사용자 경험**: 영구 데이터와 임시 데이터의 명확한 분리

---

**실행 완료**: 2025-01-20  
**소요 시간**: 총 약 60분 (1차 30분 + 2차 15분 + 3차 15분)
**상태**: ✅ 완료
