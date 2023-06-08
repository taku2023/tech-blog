import { type Title } from "./marks/title"
import MD from "markdown-it"
import hljs from "highlight.js"

hljs.highlightAll()

type Marks = Title | TypoGraphy | Image

type TypoGraphy = "Italic" | "Bold"
type Image = "image" | "image-"

const md: MD = MD({
  breaks: true,
  html: true,
  typographer:true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        )
      } catch (e) {
        console.error(e)
      }
    }

    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    )
  },
})
export default md
