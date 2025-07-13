import { QuartzEmitterPlugin } from "../types"
import { BuildCtx } from "../../util/ctx"
import { FilePath } from "../../util/path"
import { StaticResources } from "../../util/resources"
import { ProcessedContent } from "../vfile"
import { globby } from "globby"
import esbuild from "esbuild"
import path from "path"
import { promises as fs } from "fs"

/**
 * Worker Builder Emitter Plugin
 * 负责构建和输出 Web Worker 文件到 public 目录
 */
export const WorkerBuilder: QuartzEmitterPlugin = () => {
  return {
    name: "WorkerBuilder",
    getQuartzComponents() {
      return []
    },
    async emit(ctx: BuildCtx, _content: ProcessedContent[], _resources: StaticResources): Promise<FilePath[]> {
      const { argv } = ctx
      const emittedFiles: FilePath[] = []

      try {
        // 查找所有 .worker.ts 文件
        const workerFiles = await globby("quartz/components/scripts/**/*.worker.ts", {
          cwd: path.resolve("."),
          absolute: true
        })

        console.log(`Found ${workerFiles.length} worker files to build`)

        // 为每个 worker 文件创建单独的构建
        for (const workerFile of workerFiles) {
          const relativePath = path.relative(path.resolve("."), workerFile)
          const outputName = path.basename(workerFile, ".ts") + ".js"
          const outputPath = path.join(argv.output, outputName)

          console.log(`Building worker: ${relativePath} -> ${outputName}`)

          // 确保输出目录存在
          await fs.mkdir(path.dirname(outputPath), { recursive: true })

          // 构建 worker 文件
          await esbuild.build({
            entryPoints: [workerFile],
            outfile: outputPath,
            platform: "browser",
            format: "esm",
            bundle: true,
            minify: true,
            target: "esnext",
            sourcemap: false,
            write: true
          })

          emittedFiles.push(outputName as FilePath)
        }

        console.log(`Successfully built ${emittedFiles.length} worker files`)
      } catch (error) {
        console.error("Worker build failed:", error)
      }

      return emittedFiles
    }
  }
}