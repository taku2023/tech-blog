declare module "markdown-it-table-of-contents" {
  import { PluginSimple } from "markdown-it"
  interface Options {
    includeLevel?: number[]
  }
  const toc: PluginSimple<Option>
  export = toc
}
