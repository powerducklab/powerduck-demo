import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Fixes curlconverter's webParser.js which uses top-level await to load
 * tree-sitter WASM files from the site root ("/tree-sitter.wasm").
 * Since this app is deployed under "/demo/", those URLs return 404 and
 * crash the entire module graph via top-level await.
 *
 * Two-pronged fix:
 * 1. Dev: serve WASM files at the site root via middleware.
 * 2. Build: rewrite the WASM URLs in webParser.js to include the base path.
 */
function curlconverterWasmPlugin(base: string): Plugin {
  const normalizedBase = base.endsWith('/') ? base : base + '/'
  return {
    name: 'curlconverter-wasm-fix',
    configureServer(server) {
      // Serve WASM files at the site root during dev so that
      // curlconverter's top-level await can load them successfully.
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next()
        const wasmMatch = req.url.match(/^\/(tree-sitter(-bash)?\.wasm)$/)
        if (wasmMatch) {
          const filePath = path.resolve(process.cwd(), 'public', wasmMatch[1])
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/wasm')
            fs.createReadStream(filePath).pipe(res)
            return
          }
        }
        next()
      })
    },
    transform(code, id) {
      // During build, rewrite the WASM URLs to include the base path.
      if (id.includes('curlconverter') && id.includes('webParser.js')) {
        return code
          .replace(
            'return "/" + scriptName;',
            `return "${normalizedBase}" + scriptName;`,
          )
          .replace(
            '"/tree-sitter-bash.wasm"',
            `"${normalizedBase}tree-sitter-bash.wasm"`,
          )
      }
      return null
    },
    closeBundle() {
      // During build, also copy WASM files to the root of dist as a fallback
      // in case the transform didn't catch all references.
      const distDir = path.resolve(process.cwd(), 'dist')
      const publicDir = path.resolve(process.cwd(), 'public')
      for (const file of ['tree-sitter.wasm', 'tree-sitter-bash.wasm']) {
        const src = path.join(publicDir, file)
        const dest = path.join(distDir, file)
        if (fs.existsSync(src) && !fs.existsSync(dest)) {
          fs.copyFileSync(src, dest)
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Deploy under /demo/ subdirectory on powerduck.com
  base: '/demo/',
  plugins: [react(), curlconverterWasmPlugin('/demo/')],
  optimizeDeps: {
    // Pre-build CommonJS modules so they work with ES module imports
    include: ['web-tree-sitter', 'curlconverter', '@powerduck/x-to-openapi'],
  },
  // Ensure .wasm files are treated as static assets
  assetsInclude: ['**/*.wasm'],
  worker: {
    format: 'es',
  },
})
