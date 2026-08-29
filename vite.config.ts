import { defineConfig } from 'vite';

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify('__BUILD_ID__') },
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
