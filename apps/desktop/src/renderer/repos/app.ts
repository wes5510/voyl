/**
 * 앱 초기화 상태 확인
 */
export async function isInitialized(): Promise<boolean> {
  try {
    return await window.electronAPI.isInitialized()
  } catch (error) {
    console.error('Failed to check initialization status:', error)
    return false
  }
}

/**
 * 워크스페이스 경로 선택 (Documents 초기 경로)
 */
export async function selectWorkspacePath(): Promise<string | null> {
  try {
    return await window.electronAPI.selectWorkspacePath()
  } catch (error) {
    console.error('Failed to open directory dialog:', error)
    return null
  }
}

/**
 * 앱 초기화 (설정 생성 + 워크스페이스 폴더 생성)
 */
export async function initializeApp(path: string): Promise<void> {
  try {
    await window.electronAPI.initializeApp(path)
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
    await window.electronAPI.loadApp()
  } catch (error) {
    console.error('Failed to load app:', error)
    throw new Error((error as Error).message || 'Failed to load app')
  }
}