import hljs from "highlight.js"
import MD from "markdown-it"

hljs.highlightAll()

const md: MD = MD({
  breaks: true,
  html: true,
  typographer: true,
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
