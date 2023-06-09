import { Article as ArticleData, get } from "@/data/api/articles"
import md from "@/libs/markdown/converter"
import { LoaderFunction } from "react-router"
import { useLoaderData } from "react-router-dom"
import "./Article.scss"

const getArticleLoader: LoaderFunction = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const article = await get(params.id!)
  return { article }
}

const Article = () => {
  const { article } = useLoaderData() as { article: ArticleData }
  const html = md.render(article.content)
  return (
    <>
      <article className="article">
        <section className="article-header p-1">
          <h1 className="title">{article.title}</h1>
          <div className="tags">
            {article.tags.map((tag) => {
              return <span className="tag">#{tag}</span>
            })}
          </div>
        </section>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="markdown-body p-1"
        ></div>
      </article>
    </>
  )
}

export { Article as default, getArticleLoader }
