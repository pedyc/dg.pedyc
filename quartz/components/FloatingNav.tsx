import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/floatingNav.scss"
import { classNames } from "../util/lang"

interface NavItem {
  /** Button label (e.g. "博客") */
  label: string
  /** Link href — internal path like "/60-BLOGS/" or external URL like "https://..." */
  href: string
}

interface Options {
  /** Navigation items in display order */
  items: NavItem[]
}

const defaultOptions: Options = {
  items: [
    { label: "博客", href: "/60-BLOGS/" },
    { label: "简历", href: "/简历" },
    { label: "关于我", href: "/关于我" },
  ],
}

export default ((opts?: Partial<Options>) => {
  const options: Options = { ...defaultOptions, ...opts }

  const FloatingNav: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    // fileData.slug is a FullSlug like "index" (root), "60-BLOGS/index", or "60-BLOGS/文章"
    const currentSlug = (fileData.slug ?? "").replace(/^\/+|\/+$/g, "")

    return (
      <nav class={classNames(displayClass, "floating-nav")} aria-label="主导航">
        {options.items.map((item) => {
          const isExternal = /^https?:\/\//.test(item.href)

          // Highlight the button when the current page falls under its path.
          let isActive = false
          if (!isExternal) {
            const normalizedHref = item.href.replace(/^\/+|\/+$/g, "")
            if (normalizedHref === "") {
              // Root "/" — active only on the home page
              isActive = currentSlug === "" || currentSlug === "index"
            } else {
              isActive =
                currentSlug === normalizedHref ||
                currentSlug.startsWith(`${normalizedHref}/`)
            }
          }

          return (
            <a
              href={item.href}
              class={`floating-nav-btn${isActive ? " active" : ""}`}
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {item.label}
            </a>
          )
        })}
      </nav>
    )
  }

  FloatingNav.css = style
  return FloatingNav
}) satisfies QuartzComponentConstructor
