import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import obfuscatorPlugin from './vite-plugin-obfuscator';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    obfuscatorPlugin({
      // Obfuscator options
      compact: true,
      controlFlowFlattening: true,
      deadCodeInjection: true,
      debugProtection: true,
      debugProtectionInterval: true,
      disableConsoleOutput: true,
    }, {
      // Include and exclude options for the plugin
      include: '**/*.js',
      exclude: 'node_modules/**',
    }),
  ],
  build: {
    outDir: 'build',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  react: {
    // Disable Fast Refresh
    fastRefresh: false,
  },
});
