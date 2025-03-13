import { FilePath, FullSlug, joinSegments, resolveRelative, simplifySlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import DepGraph from "../../depgraph"
import { getAliasSlugs } from "../transformers/frontmatter"
import { sanitizeFilename } from "../../util/sanitize"

export const AliasRedirects: QuartzEmitterPlugin = () => ({
  name: "AliasRedirects",
  async getDependencyGraph(ctx, content, _resources) {
    const graph = new DepGraph<FilePath>()

    const { argv } = ctx
    for (const [_tree, file] of content) {
      for (const slug of getAliasSlugs(file.data.frontmatter?.aliases ?? [], argv, file)) {
        // 使用sanitizeFilename处理slug，确保文件名安全
        const safeSlug = sanitizeFilename(slug)
        graph.addEdge(file.data.filePath!, joinSegments(argv.output, safeSlug + ".html") as FilePath)
      }
    }

    return graph
  },
  async *emit(ctx, content, _resources) {
    for (const [_tree, file] of content) {
      const ogSlug = simplifySlug(file.data.slug!)

      for (const slug of file.data.aliases ?? []) {
        // 使用sanitizeFilename处理slug，确保文件名安全
        const safeSlug = sanitizeFilename(slug)
        const redirUrl = resolveRelative(safeSlug as FullSlug, file.data.slug!)
        const fp = await write({
          ctx,
          content: `
            <!DOCTYPE html>
            <html lang="en-us">
            <head>
            <title>${ogSlug}</title>
            <link rel="canonical" href="${redirUrl}">
            <meta name="robots" content="noindex">
            <meta charset="utf-8">
            <meta http-equiv="refresh" content="0; url=${redirUrl}">
            </head>
            </html>
            `,
          slug: safeSlug as FullSlug,
          ext: ".html",
        })
      }
    }
  },
})
