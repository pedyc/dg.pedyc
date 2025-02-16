// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
import clipboardStyle from "./styles/clipboard.scss"
// @ts-ignore
import lazyloadScript from "./scripts/lazyload"
import lazyloadStyle from "./styles/lazyload.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body" data-loading-strategy="lazy">{children}</div>
}

Body.afterDOMLoaded = `
${clipboardScript}
${lazyloadScript}
`

Body.css = `
${clipboardStyle}
${lazyloadStyle}
`

export default (() => Body) satisfies QuartzComponentConstructor
