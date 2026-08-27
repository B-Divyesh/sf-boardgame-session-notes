import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    assetsInlineLimit: 2048
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
