// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
import clipboardStyle from "./styles/clipboard.scss"
// @ts-ignore
import lazyloadScript from "./scripts/lazyload.inline"
import lazyloadStyle from "./styles/lazyload.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return (
    <div id="quartz-body">
      {children}
      <script dangerouslySetInnerHTML={{ __html: clipboardScript }} />
      <script dangerouslySetInnerHTML={{ __html: lazyloadScript }} />
      <script src="https://app.rybbit.io/api/script.js" data-site-id="1531" defer></script>
    </div>
  )
}

Body.css = `
${clipboardStyle}
${lazyloadStyle}
`

export default (() => Body) satisfies QuartzComponentConstructor
