import { useLoaderData, useParams } from "react-router-dom"
import md from "@/libs/markdown/converter"
import { get, Article as ArticleData } from "@/data/api/articles"
import { LoaderFunction } from "react-router"

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
        <h1 className="title">{article.title}</h1>
        <div dangerouslySetInnerHTML={{__html: html}} className="markdown-body"></div>
      </article>
    </>
  )
}

export { Article as default, getArticleLoader }
