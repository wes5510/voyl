# Context: IPC 보일러플레이트 최소화

## 작업 배경

새 IPC 채널 추가 시 preload/index.ts에서 수동으로 함수를 정의해야 하는 보일러플레이트가 존재함.

**이전 시도**: Proxy 객체를 사용한 자동 API 생성 시도 → `contextBridge.exposeInMainWorld`가 structured clone을 사용하므로 Proxy 객체 전달 불가 → 버그 발생 → 현재 명시적 함수 객체로 롤백된 상태

**현재 코드 상태**:
- `main/ipc/index.ts`: handlers 객체에서 타입 추출 (`ChannelApi`), `registerHandlers()`로 자동 등록 ✓
- `preload/index.ts`: 여전히 수동으로 12개 API 함수 정의 (보일러플레이트)
- `common/channel.type.ts`: `ChannelApi` 타입 export (main에서 생성된 타입 사용)

## 목표

preload/index.ts의 보일러플레이트를 최소화하면서 Electron의 structured clone 제약을 우회하는 방법 찾기.

**구체적 목표**:
1. 새 IPC 채널 추가 시 preload 수정 불필요 또는 최소화
2. 타입 안전성 유지
3. Electron 보안 정책 준수 (contextIsolation)

## 제약사항

- **Electron 제약**: `contextBridge.exposeInMainWorld`는 structured clone 사용 → Proxy, 함수 참조 등 전달 불가
- **아키텍처**: preload는 main/renderer 모두 접근 가능한 브릿지 역할
- **기술**: Proxy 기반 접근법 사용 불가 (이미 실패)

## 의사결정

(analyzer 결과 반영 예정)
