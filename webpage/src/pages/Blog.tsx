import { Summary, download, get } from "@/data/api/blogs"
import md from "@/libs/markdown/converter"
import { LoaderFunction } from "react-router"
import { useLoaderData } from "react-router-dom"
import "./Article.scss"

const getBlogsLoader: LoaderFunction = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const content = await download(params.id!)
  const summary = await get(params.id!)
  return { summary, content }
}

const BlogPage = () => {
  const { summary, content } = useLoaderData() as {
    summary: Summary
    content: string
  }

  const html = md.render(content)
  return (
    <>
      <article className="article">
        <section className="article-header p-1">
          <h1 className="title">{summary.title}</h1>
          <div className="tags">
            {summary.keywords.map((tag) => {
              return (
                <span className="tag" key={tag}>
                  #{tag}
                </span>
              )
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

export { BlogPage as default, getBlogsLoader }
