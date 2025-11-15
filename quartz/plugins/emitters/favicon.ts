import sharp from "sharp"
import { joinSegments, QUARTZ, FullSlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import fs from "fs"

export const Favicon: QuartzEmitterPlugin = () => ({
  name: "Favicon",
  async *emit({ argv }) {
    const iconPath = joinSegments(QUARTZ, "static", "icon.png")
    const outPath = joinSegments(argv.output, "favicon.ico")

    try {
      const [srcStat, outStat] = [
        await fs.promises.stat(iconPath),
        await fs.promises.stat(outPath).catch(() => null),
      ]
      if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
        return
      }
    } catch {}

    const faviconContent = sharp(iconPath).resize(48, 48).toFormat("png")

    yield write({
      ctx: { argv } as BuildCtx,
      slug: "favicon" as FullSlug,
      ext: ".ico",
      content: faviconContent,
    })
  },
  async *partialEmit() {},
})
