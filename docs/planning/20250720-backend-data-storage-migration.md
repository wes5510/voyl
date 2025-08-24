# 백엔드 데이터 저장 방식 변경 프로젝트 개요

**작성일**: 2025-07-20  
**수정일**: 2025-08-24  
**모드**: PLAN 개요 (인프라 레이어 구현 완료)

## 🎯 프로젝트 목표

### 현재 상태

- **데이터 저장**: SQLite + Drizzle ORM
- **저장 위치**: 고정된 경로 (개발: app 경로, 프로덕션: userData)
- **데이터 구조**: 관계형 DB 테이블 (nodes, nodeTypes, attributes)

### 목표 상태

- **데이터 저장**: 파일 시스템 + JSON
- **저장 위치**: 사용자 선택 (클라우드 동기화 가능)
- **데이터 구조**: 개별 JSON 파일 + SQLite 캐시

### 변경 이유 (PRD 요구사항)

- **사용자 선택**: 첫 실행 시 저장 위치 선택
- **클라우드 친화**: Google Drive, Dropbox 등 동기화
- **파일 시스템**: 원천 데이터 (Source of Truth)
- **SQLite**: 검색/정렬 성능용 캐시만

---

## 🏗️ 아키텍처 변경 개요

### 현재 아키텍처

```
Renderer (Frontend)
  ↓ IPC 호출
IPC Handlers (/main/ipc/)
  ↓ Models 호출
Models (/main/models/)
  ↓ DB 함수 호출
DB Layer (/main/db/)
  ↓ Drizzle ORM
SQLite (database.sqlite)
```

### 목표 아키텍처

```
Renderer (Frontend)
  ↓ IPC 호출 (동일)
IPC Handlers (/main/ipc/)
  ↓ Models 호출 (동일)
Models (/main/models/)
  ↓ Repository 호출 (NEW)
Repository Layer (/main/repos/)
  ↓ JSON I/O + SQLite Cache
.voyl/ 폴더 + userData/cache.db
```

### 핵심 설계 원칙

- **인터페이스 보존**: Models 이상 레이어는 변경 없음
- **점진적 전환**: 기존 시스템과 병행 운영 가능
- **데이터 안전**: 마이그레이션 중 데이터 손실 방지

---

## 📋 중간 단위 분해

### **1. 인프라 레이어 구현** 📁 [상세 계획](./20250720-infrastructure-layer/)

**목표**: 워크스페이스 경로 관리 및 초기화 인프라 구축

- **경로 관리**: 앱 데이터와 워크스페이스 분리된 2-tier 구조
- **워크스페이스 초기화**: 폴더 생성, 권한 검증, 에러 처리
- **IPC 통신**: 백엔드-프론트엔드 워크스페이스 관리 API
- **저장 위치 선택 UI**: 직관적인 사용자 경험
- **앱 시작 통합**: 첫 실행 vs 기존 사용자 플로우

**완료 기준**: 사용자가 워크스페이스 경로를 지정하고 폴더가 생성됨

**구현 상태**: ✅ 완료 (2025-08-24)  
**상세 내용**: [📋 README.md](./20250720-infrastructure-layer/README.md) 참조

### **2. 데이터 레이어 구현**

**목표**: Repository 패턴으로 데이터 저장소 CRUD 구현

- Node 파일 저장소 (JSON CRUD)
- Attribute 저장소
- NodeType 저장소 (settings.json 관리)
- SQLite 캐시 레이어

**완료 기준**: 기존 DB 인터페이스와 동일한 기능을 Repository 레이어로 제공

### **3. 통합 및 마이그레이션**

**목표**: 기존 시스템에서 새 시스템으로 완전 전환

- 기존 Models 레이어와 연결
- SQLite → JSON 마이그레이션 도구
- 점진적 전환 (Feature flag)
- 기존 DB 코드 정리

**완료 기준**: 기존 SQLite 의존성 완전 제거, Repository 레이어만 사용

---

## 🔄 데이터 매핑 전략

### SQLite → Repository 매핑

```
현재:
├── nodes 테이블 → .voyl/nodes/[nodeId].json
├── nodeTypes 테이블 → .voyl/settings.json의 nodeTypes 배열
└── attributes 테이블 → .voyl/nodes/[nodeId].json의 attributeIds 참조

캐시:
└── database.sqlite → userData/voyl/cache.db (검색/정렬 전용)
```

### 파일 스키마 요약

```json
// nodes/[nodeId].json
{
  "id": "uuid-v4",
  "parentId": "uuid-v4" | null,
  "title": "string",
  "attributeIds": ["uuid-v4"],
  "createdAt": 1737366600000,
  "updatedAt": 1737366600000
}

// settings.json
{
  "version": "1.0.0",
  "nodeTypes": [...],
  "attributes": [...]
}
```

---

## ✅ 성공 기준

### 기능적 성공 기준

- [ ] 사용자가 저장 위치를 선택할 수 있음
- [ ] 기존 모든 노드 작업이 Repository 레이어에서 동작
- [ ] 클라우드 폴더에 저장 시 다른 기기에서 접근 가능
- [ ] 기존 사용자 데이터가 손실 없이 마이그레이션됨

### 기술적 성공 기준

- [ ] IPC, Models 레이어 코드 변경 없음
- [ ] 기존 TypeScript 인터페이스 완전 호환
- [ ] SQLite 의존성 완전 제거
- [ ] 성능 저하 없음 (캐시 레이어로 보완)

### 사용자 경험 기준

- [ ] 첫 실행 시 직관적인 저장 위치 선택
- [ ] 마이그레이션 과정에서 앱 사용 중단 없음
- [ ] 에러 발생 시 명확한 메시지와 복구 방안

---

## ⚠️ 리스크 및 대응 방안

### 주요 리스크

1. **데이터 마이그레이션 실패**

   - 대응: 자동 백업 + 롤백 메커니즘
   - 대응: 점진적 전환으로 검증

2. **성능 저하**

   - 대응: SQLite 캐시 레이어 유지
   - 대응: 메모리 인덱싱 추가

3. **파일 충돌 (클라우드 동기화)**

   - 대응: 작은 개별 파일로 충돌 최소화
   - 대응: 타임스탬프 기반 충돌 해결

4. **복잡도 증가**
   - 대응: 인터페이스 보존으로 변경 범위 제한
   - 대응: 단계별 구현으로 리스크 분산

### 롤백 계획

- 각 단계마다 이전 상태로 복원 가능
- Feature flag로 즉시 기존 시스템으로 전환
- 자동 백업으로 데이터 복구

---

## 📊 구현 순서 및 의존성

```
1. 인프라 레이어 구현 (독립적)
   ↓
2. 데이터 레이어 구현 (1번 의존)
   ↓
3. 통합 및 마이그레이션 (1,2번 의존)
```

### 진행 상황

- **1. 인프라 레이어**: ✅ 완료 (2025-08-24)
- **2. 데이터 레이어**: 📅 예정 (2-3주)
- **3. 통합 및 마이그레이션**: 📅 예정 (1-2주)

**남은 예상 기간: 3-5주**

---

## 🚦 다음 단계

1. **중간 단위 1: 인프라 레이어 구현** 상세 계획 수립
2. 각 중간 단위별 독립적 PLAN 문서 작성
3. 작은 태스크 단위로 순차 실행

---

_개요 작성일: 2025-07-20_  
_최종 수정일: 2025-08-24_
