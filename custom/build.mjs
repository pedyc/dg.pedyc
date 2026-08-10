#!/usr/bin/env node
/**
 * Builds the local Quartz v5 plugins under custom/ into dist/ bundles.
 * These bundles are loaded at runtime by Quartz's plugin loader, so they
 * must be plain JS (Node cannot import .ts/.tsx/.scss at runtime).
 */
import { build } from "esbuild"
import { sassPlugin } from "esbuild-sass-plugin"
import { fileURLToPath } from "node:url"
import path from "node:path"
import fs from "node:fs"

const root = path.dirname(fileURLToPath(import.meta.url))

// Packages that resolve from the host Quartz app's node_modules at runtime.
const external = [
  "preact",
  "preact-render-to-string",
  "@quartz-community/types",
  "@quartz-community/utils",
]

const shared = {
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  jsx: "automatic",
  jsxImportSource: "preact",
  external,
  logLevel: "info",
  plugins: [
    sassPlugin({
      type: "css-text",
      cssImports: true,
    }),
  ],
}

const targets = [
  {
    name: "floating-nav",
    entries: [
      { in: "floating-nav/index.ts", out: "floating-nav/dist/index" },
      { in: "floating-nav/components.ts", out: "floating-nav/dist/components" },
    ],
  },
  {
    name: "poetry",
    entries: [{ in: "poetry/index.ts", out: "poetry/dist/index" }],
  },
]

for (const plugin of targets) {
  for (const entry of plugin.entries) {
    const entryPoint = path.join(root, entry.in)
    if (!fs.existsSync(entryPoint)) {
      console.warn(`Skipping missing entry: ${entry.in}`)
      continue
    }
    await build({
      ...shared,
      entryPoints: [entryPoint],
      outfile: path.join(root, entry.out + ".js"),
    })
    console.log(`✓ Built ${plugin.name}: ${entry.out}.js`)
  }
}
