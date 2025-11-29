repo 동기화를 해보자

- 동기화란?
  - sqlite와 파일시스템의 내용이 불일치할때
    - 생성: 파일에만 있는 데이터 → SQLite에 추가
    - 삭제: SQLite에만 있는 데이터 → SQLite에서 제거
    - 수정: mtime과 syncedAt 비교하여 최신 데이터로 동기화
- 추가 고려사항
  - 앱을 처음 사용할때
    - sqlite도 없을 것이고 파일시스템도 아무것도 없음
    - 이미 app 초기화 플로우는 있긴함
      - 초기화 확인
      - 초기화 안되어 있다면, workspace 경로 선택
      - workspace에 node, ... 같은 폴더들 생성 -> 이건 지금은 없고 repo 에 만들어야할듯
    - 근데 sqlite 테이블부터 만들어야하지 않음?
    - appRepo.create 는 있음 -> 이것도. 그럼 여기서 table 만드는 작업까지 같이 해야되지 않음?
    - workRepo.create 는 없음 -> 이것도
    - nodeRepo.create 도 없음 -> 이건 초기화라는 거니까 init이 되어야하지 않음?
  - 앱을 처음 사용하지 않을때
    - sqlite 있고

  - 플로우
    - renderer에서 초기화 확인
      - 초기화되어 있으면
        1. 동기화 진행
      - 초기화안되어 있으면
        1. 초기화 진행
        2. 동기화 진행

## 초기화
  - [x] 앱 초기화 (AppRepo.initialize)
    - 앱 초기데이터 파일(app.json)에 저장
    - 앱 테이블 생성 (drizzle-kit API 사용)
    - ~~앱 초기데이터 sqlite에 저장~~ → 동기화에서 처리
  - [ ] 워크스페이스 초기화 (WorkspaceRepo.initialize)
    - 워크스페이스 초기 데이터 파일(${workspacePath}/workspace.json)에 저장
    - 워크스페이스 테이블 생성
    - ~~워크스페이스 초기데이터 sqlite에 저장~~ → 동기화에서 처리
  - [ ] Node 초기화 (NodeRepo.initialize)
    - Node 초기 폴더 생성
    - Node 테이블 생성
    - Root 노드 파일 생성
    - ~~Node 초기데이터 sqlite에 저장~~ → 동기화에서 처리

## 동기화

### 동기화 메타데이터 테이블
```typescript
// sync_metadata 테이블 구조
export const syncMetadata = sqliteTable('sync_metadata', {
  path: text('path').primaryKey(),           // 파일 경로
  tableName: text('table_name').notNull(),   // 'app', 'workspace', 'node'
  syncedAt: integer('synced_at', { mode: 'timestamp' }).notNull()
})
```

### 동기화 케이스
1. **추가**: 파일만 있고 DB에 없음 → DB에 생성
2. **수정**: 둘 다 있고 파일이 더 최신 → DB 업데이트
3. **삭제**: DB에만 있고 파일 없음 → DB에서 제거

### 단일 파일 동기화 (AppRepo, WorkspaceRepo)
```typescript
export const sync = async (): Promise<void> => {
  const fileExists = await fs.exists(PATH)
  const dbData = await db.get()
  const metadata = await db.getSyncMetadata(PATH, 'app')
  
  if (!fileExists && dbData) {
    // 삭제: 파일 없고 DB에만 있음
    await db.delete()
    await db.deleteSyncMetadata(PATH, 'app')
    
  } else if (fileExists && !dbData) {
    // 추가: 파일만 있고 DB에 없음
    const fileData = await fs.read()
    await db.create(fileData)
    const fileStat = await fs.stat(PATH)
    await db.createSyncMetadata(PATH, 'app', fileStat.mtime.getTime())
    
  } else if (fileExists && dbData) {
    // 수정 체크: 둘 다 있음
    const fileStat = await fs.stat(PATH)
    const fileMtime = fileStat.mtime.getTime()
    
    if (!metadata || fileMtime > metadata.syncedAt) {
      const fileData = await fs.read()
      await db.update(fileData)
      await db.updateSyncMetadata(PATH, 'app', fileMtime)
    }
  }
}
```

### 다중 파일 동기화 (NodeRepo)
```typescript
export const sync = async (): Promise<void> => {
  const files = await fs.listNodes()  // nodes/*.json
  const dbNodes = await db.getAllNodes()
  
  // 삭제 처리
  for (const dbNode of dbNodes) {
    if (!files.find(f => f.path === dbNode.path)) {
      await db.delete(dbNode.id)
      await db.deleteSyncMetadata(dbNode.path, 'node')
    }
  }
  
  // 추가/수정 처리
  for (const file of files) {
    const dbNode = dbNodes.find(n => n.path === file.path)
    const metadata = await db.getSyncMetadata(file.path, 'node')
    
    if (!dbNode) {
      // 추가
      await db.create(file.data)
      await db.createSyncMetadata(file.path, 'node', file.mtime)
    } else if (!metadata || file.mtime > metadata.syncedAt) {
      // 수정
      await db.update(file.data)
      await db.updateSyncMetadata(file.path, 'node', file.mtime)
    }
  }
}
```

## 구현 현황
- [x] AppRepo 구조 리팩토링 (db.ts, fs.ts 분리)
- [x] drizzle-kit API로 테이블 생성
- [ ] sync_metadata 테이블 구현
- [ ] AppRepo.sync() 구현
- [ ] WorkspaceRepo 구현
- [ ] NodeRepo 구현
