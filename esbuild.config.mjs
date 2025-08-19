import esbuild from "esbuild"
import { cacheFile, fp } from "./quartz/cli/constants.js"
import { sassPlugin } from "esbuild-sass-plugin"
import { promises } from "fs"
// import { visualizer } from "esbuild-visualizer";
import path from "path"

const esConfig = {
  entryPoints: [fp],
  outfile: cacheFile,
  platform: "node",
  format: "esm",
  jsx: "automatic",
  jsxImportSource: "preact",
  packages: "external",
  sourcemap: false,
  sourcesContent: true,
  bundle: true,
  keepNames: true,
  minify: true,
  treeShaking: true,
  metafile: true,
  plugins: [
    sassPlugin({
      type: "css-text",
      cssImports: true,
    }),
    sassPlugin({
      filter: /\.inline\.scss$/,
      type: "css",
      cssImports: true,
    }),
    {
      name: "inline-script-loader",
      setup(build) {
        build.onLoad({ filter: /\.inline\.(ts|js)$/ }, async (args) => {
          let text = await promises.readFile(args.path, "utf8")

          // remove default exports that we manually inserted
          // No longer filtering imports/exports here, esbuild.transform will handle it.

          const sourcefile = path.relative(path.resolve("."), args.path)
          const resolveDir = path.dirname(sourcefile)
          const transpiled = await esbuild.transform(text, {
            loader: "ts",
            minify: true,
            treeShaking: true,
            target: "esnext",
            format: "iife",
          })
          const rawMod = transpiled.code

          return {
            contents: rawMod,
            loader: "text",
          }
        })
      },
    },
    // visualizer()
  ],
}

// const isProduction = process.argv.includes('build') && !process.argv.includes('--serve')

// if (isProduction) {
//   esConfig.plugins.push({
//     name: "bundle-visualizer",
//     ...visualizer({
//       filename: 'bundle-analysis.html',
//       gzipSize: true,
//       metadata: true
//     })
//   })
// }

export default esConfig
