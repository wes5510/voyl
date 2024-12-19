export default {
  plugins: ['voyl'],
  rules: {
    'voyl/dependency-direction': 'error',
    'voyl/import-path-format': 'error',
    'voyl/component-location': 'error',
    'voyl/module-type-control': 'error',
    'voyl/import-order': [
      'error',
      {
        groups: [
          ['react'],
          ['external'],
          ['^@/pages/shared'],
          ['^@/pages/.*/shared'],
          ['^@/pages/.*/components'],
          ['^\\./'],
        ],
      },
    ],
  },
}
