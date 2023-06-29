import { Summary, download, get } from "@/data/api/blogs"
import md from "@/libs/markdown/converter"
import { LoaderFunction } from "react-router"
import { useLoaderData } from "react-router-dom"
import "./Blog.scss"

const getBlogsLoader: LoaderFunction = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const key = params.key!!
  const content = await download(key)
  const {blog} = await get(key)
  console.log(content)
  return { blog, content }
}

const BlogPage = () => {
  const { blog, content } = useLoaderData() as {
    blog: Summary
    content: string
  }

  const html = md.render(content)
  return (
    <>
      <article className="article">
        <section className="article-header p-1">
          <h1 className="title">{blog.title}</h1>
          <div className="tags">
            {blog.keywords.map((tag) => {
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
