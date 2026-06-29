import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    // better-sqlite3 is a native addon; forks avoid worker-thread issues.
    pool: 'forks',
  },
});
