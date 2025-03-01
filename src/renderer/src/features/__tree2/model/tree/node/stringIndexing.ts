const MID_CHAR = 'm'
const BASE_CHAR = 'a'
const END_CHAR = 'z'

/**
 * 두 인덱스 사이의 중간값을 생성합니다.
 * @param prev 이전 인덱스 (왼쪽 경계)
 * @param next 다음 인덱스 (오른쪽 경계)
 * @returns 중간값 인덱스
 */
export function generateMidKey({ prev, next }: { prev: string; next: string }): string {
  const [left, right] = normalizeInput({ prev, next })
  const commonPrefix = findCommonPrefix({ left, right })

  if (isNewLevelNeeded({ left, right, commonPrefixLength: commonPrefix.length })) {
    return left + MID_CHAR
  }

  const leftChar = getCharAt({ str: left, index: commonPrefix.length, defaultValue: BASE_CHAR })
  const rightChar = getCharAt({ str: right, index: commonPrefix.length, defaultValue: END_CHAR })

  if (isConsecutiveChars({ leftChar, rightChar })) {
    return createNewLevelKey({ commonPrefix, leftChar })
  }

  return createMidKey({ commonPrefix, leftChar, rightChar })
}

/**
 * 입력값을 정규화합니다.
 * - 빈 문자열 처리
 * - 정렬 보장 (left < right)
 */
function normalizeInput({ prev, next }: { prev: string; next: string }): [string, string] {
  if (!prev && !next) return [BASE_CHAR, END_CHAR]
  if (!prev) return [BASE_CHAR, next || END_CHAR]
  if (!next) return [prev, END_CHAR]
  return prev < next ? [prev, next] : [next, prev]
}

/**
 * 두 문자열의 공통 접두사를 찾습니다.
 */
function findCommonPrefix({ left, right }: { left: string; right: string }): string {
  let depth = 0
  while (depth < left.length && depth < right.length && left[depth] === right[depth]) {
    depth++
  }
  return left.slice(0, depth)
}

/**
 * 신규 레벨 생성이 필요한지 확인합니다.
 */
function isNewLevelNeeded({
  left,
  right,
  commonPrefixLength,
}: {
  left: string
  right: string
  commonPrefixLength: number
}): boolean {
  return commonPrefixLength === Math.max(left.length, right.length)
}
/**
 * 특정 위치의 문자를 가져옵니다. 없으면 기본값을 반환합니다.
 */
function getCharAt({
  str,
  index,
  defaultValue,
}: {
  str: string
  index: number
  defaultValue: string
}): string {
  return str[index] || defaultValue
}

/**
 * 두 문자가 연속된 문자인지 확인합니다.
 */
function isConsecutiveChars({
  leftChar,
  rightChar,
}: {
  leftChar: string
  rightChar: string
}): boolean {
  return rightChar.charCodeAt(0) - leftChar.charCodeAt(0) === 1
}

/**
 * 새로운 레벨을 생성합니다.
 */
function createNewLevelKey({
  commonPrefix,
  leftChar,
}: {
  commonPrefix: string
  leftChar: string
}): string {
  return commonPrefix + leftChar + MID_CHAR
}
/**
 * 일반 중간값을 생성합니다.
 */
function createMidKey({
  commonPrefix,
  leftChar,
  rightChar,
}: {
  commonPrefix: string
  leftChar: string
  rightChar: string
}): string {
  const midCode = Math.floor((leftChar.charCodeAt(0) + rightChar.charCodeAt(0)) / 2)
  return commonPrefix + String.fromCharCode(midCode)
}
