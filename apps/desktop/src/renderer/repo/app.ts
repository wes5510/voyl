/**
 * 앱 초기화 상태 확인
 */
export async function isInitialized(): Promise<boolean> {
  try {
    return await window.api.isInitialized()
  } catch (error) {
    console.error('Failed to check initialization status:', error)
    return false
  }
}

/**
 * 워크스페이스 경로 선택 (Documents 초기 경로)
 */
export async function selectWorkspacePath(): Promise<string | null> {
  const ret = await window.api.selectWorkspacePath()
  return ret
}

/**
 * 앱 초기화 (설정 생성 + 워크스페이스 폴더 생성)
 */
export async function initializeApp(path: string): Promise<void> {
  try {
    await window.api.initializeApp(path)
  } catch (error) {
    console.error('Failed to initialize app:', error)
    throw new Error((error as Error).message || 'Failed to initialize app')
  }
}

/**
 * 앱 로드 (DB 초기화 등)
 */
export async function loadApp(): Promise<void> {
  try {
    await window.api.loadApp()
  } catch (error) {
    console.error('Failed to load app:', error)
    throw new Error((error as Error).message || 'Failed to load app')
  }
}

export async function syncApp(): Promise<void> {
  try {
    await window.api.syncApp()
  } catch (error) {
    console.error('Failed to sync app:', error)
    throw new Error((error as Error).message || 'Failed to sync app')
  }
}
