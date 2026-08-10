import { QuartzTransformerPlugin } from "@quartz-community/types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

export const manifest = {
  name: "poetry",
  displayName: "Poetry",
  description: 'Converts fenced ```poetry code blocks into styled <pre class="poetry"> elements',
  version: "1.0.0",
  category: "transformer" as const,
}

const Poetry: QuartzTransformerPlugin = () => ({
  name: "Poetry",
  markdownPlugins() {
    return [
      () => (tree: Root, _file) => {
        visit(tree, "code", (node) => {
          if (node.lang === "poetry") {
            node.type = "html" as "code"
            node.value = `<pre class="poetry">${node.value}</pre>`
          }
        })
      },
    ]
  },
})

export default Poetry
