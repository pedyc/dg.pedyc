import { RelativeURL } from "./quartz/util/path"

declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void,
    ): void
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K] | UIEvent): void
  }
  interface Window {
    spaNavigate(pathname: RelativeURL): Promise<void>
    addCleanup(fn: (...args: any[]) => void)
  }
}
