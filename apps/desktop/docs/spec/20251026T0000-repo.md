# Repo 계층 설계

## 개요
- Model은 Repo 계층을 통해서 외부 데이터를 가져온다
- Model은 Repo 계층이 파일시스템인지 SQLite인지 알 필요 없다 (추상화)

## 데이터 저장 전략
**구조화된 데이터(JSON)는 SQLite에서, 비구조화 데이터(Markdown, 이미지 등)는 파일시스템에서 관리한다.**

### SQLite
- **저장 대상**: 구조화된 데이터 (JSON)
- **사용 이유**: 빠른 검색, 필터링, 집계, 관계 연산
- **예시**: Node 메타데이터, 태그, 설정

### 파일시스템  
- **저장 대상**: 비구조화 데이터
- **사용 이유**: 대용량 데이터, 원본 보존
- **예시**: Markdown 콘텐츠, 이미지, PDF

## MVP 구현 계획

### Repo 인터페이스
```typescript
interface NodeRepo {
  // 기본 CRUD
  get(id: string): Promise<Node>
  list(): Promise<Node[]>  
  create(node: Node): Promise<Node>
  update(id: string, data: Partial<Node>): Promise<Node>
  delete(id: string): Promise<void>
  
  // Content 별도 관리
  getContent(id: string): Promise<string>
  setContent(id: string, content: string): Promise<void>
}
```

### 트랜잭션 순서
1. **Create/Update/Delete**: 파일 먼저 → SQLite 나중 (파일이 source of truth)
2. **Read**: SQLite에서 조회
3. **Content**: 파일시스템 직접 접근

### 앱 시작 시 동기화
- SQLite와 파일시스템 간 불일치 해결
  - 생성: 파일에만 있는 데이터 → SQLite에 추가
  - 삭제: SQLite에만 있는 데이터 → SQLite에서 제거  
  - 수정: mtime과 syncedAt 비교하여 최신 데이터로 동기화

## 나중에 고려할 사항
- 에러 처리 및 복구 전략
- 성능 최적화 (캐싱, 벌크 작업)
- 실시간 동기화
- 데이터 마이그레이션
