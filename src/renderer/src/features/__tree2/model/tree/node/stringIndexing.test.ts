import { generateMidKey } from './stringIndexing'

import { describe, test, expect } from 'vitest'

describe('generateMidKey', () => {
  test('경계값 처리', () => {
    expect(generateMidKey({ prev: '', next: '' })).toBe('m')
    expect(generateMidKey({ prev: 'a', next: '' })).toBe('m')
    expect(generateMidKey({ prev: '', next: 'z' })).toBe('m')
  })

  test('정렬 보장', () => {
    expect(generateMidKey({ prev: 'b', next: 'a' })).toBe('am')
  })

  test('연속 문자 처리', () => {
    expect(generateMidKey({ prev: 'a', next: 'b' })).toBe('am')
    expect(generateMidKey({ prev: 'am', next: 'an' })).toBe('amm')
  })

  test('일반 중간값 계산', () => {
    expect(generateMidKey({ prev: 'a', next: 'c' })).toBe('b')
    expect(generateMidKey({ prev: 'aa', next: 'ab' })).toBe('aam')
  })

  test('동일한 인덱스 처리', () => {
    expect(generateMidKey({ prev: 'a', next: 'a' })).toBe('am')
  })
})
