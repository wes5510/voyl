import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['src/renderer/src/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      keyframes: {
        enter: {
          from: {
            opacity: 'var(--shadow-panda-enter-opacity, 1)',
            transform:
              'translate3d(var(--shadow-panda-enter-translate-x, 0), var(--shadow-panda-enter-translate-y, 0), 0) scale3d(var(--shadow-panda-enter-scale, 1), var(--shadow-panda-enter-scale, 1), var(--shadow-panda-enter-scale, 1)) rotate(var(--shadow-panda-enter-rotate, 0))'
          }
        },
        exit: {
          to: {
            opacity: 'var(--shadow-panda-exit-opacity, 1)',
            transform:
              'translate3d(var(--shadow-panda-exit-translate-x, 0), var(--shadow-panda-exit-translate-y, 0), 0) scale3d(var(--shadow-panda-exit-scale, 1), var(--shadow-panda-exit-scale, 1), var(--shadow-panda-exit-scale, 1)) rotate(var(--shadow-panda-exit-rotate, 0))'
          }
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      }
    }
  },

  utilities: {
    extend: {
      animateIn: {
        className: 'animate_in',
        values: { type: 'boolean' },
        transform: (value: boolean, { token }) => {
          if (!value) return {}

          return {
            animationName: 'enter',
            animationDuration: token('durations.fast'),
            '--shadow-panda-enter-opacity': 1,
            '--shadow-panda-enter-scale': 1,
            '--shadow-panda-enter-rotate': 0,
            '--shadow-panda-enter-translate-x': 0,
            '--shadow-panda-enter-translate-y': 0
          }
        }
      },
      animateOut: {
        className: 'animate_out',
        values: { type: 'boolean' },
        transform: (value: boolean, { token }) => {
          if (!value) return {}

          return {
            animationName: 'exit',
            animationDuration: token('durations.fast'),
            '--shadow-panda-exit-opacity': 1,
            '--shadow-panda-exit-scale': 1,
            '--shadow-panda-exit-rotate': 0,
            '--shadow-panda-exit-translate-x': 0,
            '--shadow-panda-exit-translate-y': 0
          }
        }
      },
      fadeIn: {
        className: 'animate_fade_in',
        values: 'opacity',
        transform: (value: number | string) => {
          return {
            '--shadow-panda-enter-opacity': value
          }
        }
      },
      fadeOut: {
        className: 'animate_fade_out',
        values: 'opacity',
        transform: (value: number | string) => {
          return {
            '--shadow-panda-exit-opacity': value
          }
        }
      },
      zoomIn: {
        className: 'animate_zoom_in',
        transform: (value: number | string) => {
          return {
            '--shadow-panda-enter-scale': Number(value) / 100
          }
        }
      },
      zoomOut: {
        className: 'animate_zoom_out',
        transform: (value: number | string) => {
          return {
            '--shadow-panda-exit-scale': Number(value) / 100
          }
        }
      },
      slideInFromTop: {
        className: 'animate_slide_in_from_top',
        values: 'spacing',
        transform: (value: number | string) => {
          return {
            '--shadow-panda-enter-translate-y': `calc(${value} * -1)`
          }
        }
      },
      slideInFromBottom: {
        className: 'animate_slide_in_from_bottom',
        values: 'spacing',
        transform: (value: number | string) => {
          return {
            '--shadow-panda-enter-translate-y': value
          }
        }
      },
      slideInFromLeft: {
        className: 'animate_slide_in_from_left',
        values: 'spacing',
        transform: (value: number | string) => {
          return {
            '--shadow-panda-enter-translate-x': `calc(${value} * -1)`
          }
        }
      },
      slideInFromRight: {
        className: 'animate_slide_in_from_right',
        values: 'spacing',
        transform: (value: number | string) => {
          return {
            '--shadow-panda-enter-translate-x': value
          }
        }
      }
    }
  },

  // The output directory for your css system
  outdir: 'styled-system'
})
