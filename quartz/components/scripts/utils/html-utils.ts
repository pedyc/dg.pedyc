/**
 * 更新页面头部信息
 * @param newDoc 新文档
 */
export function updatePageHead(newDoc: Document): void {
  // 更新或添加 title
  const newTitleElement = newDoc.head.querySelector("title")
  const currentTitleElement = document.head.querySelector("title")
  if (newTitleElement) {
    if (currentTitleElement) {
      currentTitleElement.textContent = newTitleElement.textContent
    } else {
      document.head.appendChild(newTitleElement.cloneNode(true))
    }
  }

  // 更新重要的 meta 标签
  const importantMetaNames = ["description", "keywords"]
  const importantMetaProperties = ["og:title", "og:description", "og:image", "og:url"]
  const importantMetaItemprops = ["name", "property", "itemprop"] // Added itemprop based on original code

  newDoc.head.querySelectorAll("meta").forEach((newMeta) => {
    const isImportant = importantMetaItemprops.some((attr) => {
      const value = newMeta.getAttribute(attr)
      if (!value) return false
      return importantMetaNames.includes(value) || importantMetaProperties.includes(value)
    })

    if (isImportant) {
      const attrToMatch = importantMetaItemprops.find((attr) => newMeta.hasAttribute(attr))
      if (attrToMatch) {
        const valueToMatch = newMeta.getAttribute(attrToMatch)
        const existingMeta = document.head.querySelector(`meta[${attrToMatch}="${valueToMatch}"]`)
        if (existingMeta) {
          existingMeta.setAttribute("content", newMeta.getAttribute("content") || "")
        } else {
          document.head.appendChild(newMeta.cloneNode(true))
        }
      }
    }
  })

  // 更新重要的 link 标签
  const importantLinkRels = ["canonical", "alternate", "preconnect", "preload", "prefetch"]
  newDoc.head.querySelectorAll("link").forEach((newLink) => {
    const rel = newLink.getAttribute("rel")
    if (rel && importantLinkRels.includes(rel)) {
      if (rel === "canonical" || rel === "alternate") {
        const existingLink = document.head.querySelector(`link[rel="${rel}"]`)
        if (existingLink) {
          existingLink.setAttribute("href", newLink.getAttribute("href") || "")
        } else {
          document.head.appendChild(newLink.cloneNode(true))
        }
      } else {
        // For other important links like preconnect, preload, prefetch, append them
        // Avoid duplicating if an identical link already exists (optional, but good practice)
        const existingLink = document.head.querySelector(
          `link[rel="${rel}"][href="${newLink.getAttribute("href")}"]`,
        )
        if (!existingLink) {
          document.head.appendChild(newLink.cloneNode(true))
        }
      }
    }
  })
}
