export default {
  'src/**/*.{tsx,ts,forLint}': 'pnpm --parallel lint',
  'src/**/*.{tsx,ts,forTypecheck}': () => 'pnpm typecheck',
  'src/**/*.{tsx,ts,forUnitTest}': () => 'pnpm vitest --changed --run'
}
