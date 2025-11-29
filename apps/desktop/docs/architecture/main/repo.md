# main/repo 구조

## 개요

Repo 모듈은 데이터 영속성을 관리하는 Repository 패턴을 구현합니다.
각 엔티티별로 파일시스템(fs)과 데이터베이스(db) 레이어를 통합하여 제공합니다.

## 구조

```
repo/
├── shared/
│   └── db.ts           # DB 연결 설정 (better-sqlite3, drizzle)
└── [entity]/           # 엔티티별 Repository
    ├── index.ts        # Repository 공개 API
    ├── db/             # DB 레이어 (캐시)
    │   ├── index.ts
    │   ├── schema.ts
    │   └── const.ts
    └── fs/             # 파일시스템 레이어 (소스 오브 트루스)
        ├── index.ts
        └── const.ts
```

### 구성요소

#### shared/db.ts

- better-sqlite3 + drizzle 기반 DB 연결
- WAL 모드 활성화

#### 각 엔티티 Repository ([entity]/)

- `index.ts`: Repository 공개 API (fs + db 통합)
- `db/`: SQLite 캐시 레이어
- `fs/`: 파일시스템 레이어 (JSON 파일)

## 규칙

### Import 규칙

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import할 수 있습니다.

#### voyl/restrict-imports-to-pattern

- common과 동일 repo 내 파일만 import 가능합니다.
