import * as FlexSearch from "flexsearch"

export interface Item {
  id: number
  slug: string
  title: string
  content: string
  tags: string[]
  field: string
}

export type SearchType = "basic" | "tags"
export const currentSearchTerm = {
  value: "",
  set(newValue: string) {
    this.value = newValue
  },
}
export const numSearchResults = 8

export const encoder = (str: string) => str.toLowerCase().split(/([^a-z]|[^\x00-\x7F])/)
export let index = new FlexSearch.Document({
  preset: "score",
  encode: encoder,
  document: {
    id: "id",
    tag: "tags",
    index: [
      {
        field: "title",
        tokenize: "forward",
      },
      {
        field: "content",
        tokenize: "forward",
      },
      {
        field: "tags",
        tokenize: "forward",
      },
    ],
  },
})
