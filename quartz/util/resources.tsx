import { randomUUID } from "crypto"
import { JSX } from "preact/jsx-runtime"

export type JSResource = {
  loadTime: "beforeDOMReady" | "afterDOMReady"
  moduleType?: "module"
  spaPreserve?: boolean
  async?: boolean
  defer?: boolean
  preload?: boolean
} & (
    | {
      src: string
      contentType: "external"
    }
    | {
      script: string
      contentType: "inline"
    }
  )

export type CSSResource = {
  content: string
  inline?: boolean
  spaPreserve?: boolean
}

export function JSResourceToScriptElement(resource: JSResource, preserve?: boolean): JSX.Element {
  const scriptType = resource.moduleType ?? "application/javascript"
  const spaPreserve = preserve ?? resource.spaPreserve
  const commonProps = {
    type: scriptType,
    "spa-preserve": spaPreserve,
    async: resource.async,
    defer: resource.defer
  }

  if (resource.contentType === "external") {
    // 如果设置了 preload，添加 preload link
    if (resource.preload) {
      return (
        <>
          <link
            rel="preload"
            href={resource.src}
            as="script"
            key={`preload-${resource.src}`}
          />
          <script key={resource.src} src={resource.src} {...commonProps} />
        </>
      )
    }
    return <script key={resource.src} src={resource.src} {...commonProps} />
  } else {
    const content = resource.script
    return (
      <script
        key={randomUUID()}
        {...commonProps}
        dangerouslySetInnerHTML={{ __html: content }}
      ></script>
    )
  }
}

export function CSSResourceToStyleElement(resource: CSSResource, preserve?: boolean): JSX.Element {
  const spaPreserve = preserve ?? resource.spaPreserve
  if (resource.inline ?? false) {
    return <style>{resource.content}</style>
  } else {
    return (
      <link
        key={resource.content}
        href={resource.content}
        rel="stylesheet"
        type="text/css"
        spa-preserve={spaPreserve}
      />
    )
  }
}

export interface StaticResources {
  css: CSSResource[]
  js: JSResource[]
}
