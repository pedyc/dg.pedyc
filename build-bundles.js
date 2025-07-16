import esbuild from "esbuild"

const bundles = [
  {
    entry: "quartz/components/scripts/graph.bundle.ts",
    outfile: "quartz/static/graph.bundle.js",
  },
  {
    entry: "quartz/components/scripts/search.bundle.ts",
    outfile: "quartz/static/search.bundle.js",
  },
  {
    entry: "quartz/components/scripts/mermaid.bundle.ts",
    outfile: "quartz/static/mermaid.bundle.js",
  },
]

Promise.all(
  bundles.map(({ entry, outfile }) =>
    esbuild.build({
      entryPoints: [entry],
      outfile,
      platform: "browser",
      format: "iife", // 让 window.xxx 可用
      bundle: true,
      minify: false,

      treeShaking: true,
      target: "esnext",
      sourcemap: false,
    }),
  ),
).catch(() => process.exit(1))
