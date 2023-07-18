import hljs from "highlight.js"
import "highlight.js/styles/agate.css"
import MD from "markdown-it"
import * as anchor from "markdown-it-anchor"

hljs.highlightAll()

const md: MD = MD({
  breaks: true,
  html: true,
  typographer: true,
  linkify: true,
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

md.use(anchor.default)

export default md
