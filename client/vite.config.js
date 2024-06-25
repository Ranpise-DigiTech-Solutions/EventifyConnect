import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: 'build',
  },
  css: {
    postcss: './postcss.config.js',
  },
  react: {
    // Disable Fast Refresh
    fastRefresh: false,
  },
})
