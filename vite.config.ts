import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from "rollup-plugin-polyfill-node";
import viteCopyPlugin from '@col0ring/vite-plugin-copy'
import path from 'path'

function resolve(relativePath: string) {
  return path.resolve(__dirname, relativePath)
}

const production = process.env.NODE_ENV === "production";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      plugins: [
        // ↓ Needed for build
        nodePolyfills()
      ]
    },
    // ↓ Needed for build if using WalletConnect and other providers
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  plugins: [
    viteCopyPlugin([
      {
        src: resolve('./CNAME'),
        target: [resolve('./dist')]
      }
    ]),
    react(),
    !production &&
    nodePolyfills({
      include: ["node_modules/**/*.js", new RegExp("node_modules/.vite/.*js")]
    })
  ]
})
