import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Breadcrumb from './Breadcrumb'

describe('Breadcrumb', () => {
  test('renders with a single item', () => {
    render(
      <Breadcrumb
        items={[
          {
            text: '1',
            href: '/'
          }
        ]}
      />
    )

    expect(screen.getByText('1')).toBeDefined()
  })

  test('renders with two items', () => {
    render(
      <Breadcrumb
        items={[
          {
            text: '1',
            href: '/1'
          },
          {
            text: '2',
            href: '/2'
          }
        ]}
      />
    )

    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText('2')).toBeDefined()
  })

  test('renders with three items', () => {
    render(
      <Breadcrumb
        items={[
          {
            text: '1',
            href: '/1'
          },
          {
            text: '2',
            href: '/2'
          },
          {
            text: '3',
            href: '/3'
          }
        ]}
      />
    )

    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText('2')).toBeDefined()
    expect(screen.getByText('3')).toBeDefined()
  })

  test('renders with four items, showing first and last while collapsing middle items', () => {
    render(
      <Breadcrumb
        items={[
          {
            text: '1',
            href: '/1'
          },
          {
            text: '2',
            href: '/2'
          },
          {
            text: '3',
            href: '/3'
          },
          {
            text: '4',
            href: '/4'
          }
        ]}
      />
    )

    expect(screen.getByText('1')).toBeDefined()
    expect(screen.getByText('...')).toBeDefined()
    expect(screen.getByText('4')).toBeDefined()
    expect(() => screen.getByText('2')).toThrowError()
    expect(() => screen.getByText('3')).toThrowError()
  })
})
