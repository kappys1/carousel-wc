import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/lib/index.ts',
      formats: ['es', 'umd'],
      name: 'carousel'
    },
    rollupOptions: {
      external: /^lit/,
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          lit: 'lit',
          'lit/directive.js': 'lit/directive',
          'lit/decorators.js': 'lit/decorators_js'
        }
      }
    }
  }
})
