import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Backlinks(),
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "pedyc/dg.pedyc",
        repoId: "R_kgDOMwI1yg",
        category: "Announcements",
        categoryId: "DIC_kwDOMwI1ys4Civ4e",
        themeUrl: "/static/giscus",
        lightTheme: "giscus-light",
        darkTheme: "giscus-dark",
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/pedyc/dg.pedyc",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        {
          Component: Component.Darkmode(), // Darkmode keeps its natural size
        },
        {
          Component: Component.ReaderMode()
        }
      ],
    }),
    Component.Explorer(),
  ],

  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Graph(),
    Component.RecentNotes(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(), // Darkmode keeps its natural size
    Component.Explorer(),
  ],
  right: [],
}
