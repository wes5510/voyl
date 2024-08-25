export default {
  'src/**/*.{tsx,ts}': ['pnpm lint', () => 'pnpm typecheck', () => 'pnpm vitest --changed --run']
}
