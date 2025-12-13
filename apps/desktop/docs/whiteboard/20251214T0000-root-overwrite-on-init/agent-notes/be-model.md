# Backend Model 구현 결과

## 수정된 함수

### `TreeModel.initialize`

**파일**: `/apps/desktop/src/main/model/tree/index.ts`

**변경 내용**: root node 존재 여부를 확인한 후 조건부로 생성하도록 수정

```typescript
export async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  await NodeModel.initialize({ workspaceDirPath })
  const rootExists = await NodeModel.isExist({ id: ROOT_NODE.id })
  if (!rootExists) {
    await NodeModel.addNode(ROOT_NODE)
  }
}
```

**수정 이유**:
- 기존 코드는 무조건 `NodeModel.addNode(ROOT_NODE)`를 호출하여 기존 root node를 덮어씌움
- 수정 후 root node가 이미 존재하면 생성하지 않음

## 외부 인터페이스

### 사용된 NodeModel 함수

- `NodeModel.initialize({ workspaceDirPath })`: NodeRepo 경로 설정 및 초기화
- `NodeModel.isExist({ id })`: 특정 id를 가진 node 존재 여부 확인
- `NodeModel.addNode(node)`: 새로운 node 추가

## 연결 포인트

### Repo 레이어 연결

`TreeModel.initialize` → `NodeModel` (중간 레이어) → `NodeRepo`:
- `NodeModel.initialize` → `NodeRepo.setPath`, `NodeRepo.initialize`
- `NodeModel.isExist` → `NodeRepo.isNodeExist`
- `NodeModel.addNode` → `NodeRepo.addNode`

### IPC 레이어 연결

`TreeModel.initialize`는 IPC를 통해 호출됨:
- IPC 핸들러에서 workspace 경로를 전달받아 초기화 수행
- root node 존재 여부를 확인하여 중복 생성 방지

## 비즈니스 로직

### Root Node 생성 규칙

1. workspace 초기화 시 root node가 없으면 생성
2. 이미 root node가 존재하면 기존 node 유지 (덮어쓰기 방지)
3. root node 정보는 `ROOT_NODE` 상수에 정의됨 (`./const.js`)
