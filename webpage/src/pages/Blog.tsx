import { download } from "@/data/api/blogs"
import md from "@/libs/markdown/converter"
import { LoaderFunction } from "react-router"
import { useLoaderData } from "react-router-dom"
import "./Blog.scss"
import "github-markdown-css"

const getBlogsLoader: LoaderFunction = async ({ params }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const dir = params.dir!!
  const content = await download(dir)
  const imgSrc = `${location.origin}/__blogs__/${dir}/images/banner.png`
  return { content, imgSrc }
}

const BlogPage = () => {
  const { content, imgSrc } = useLoaderData() as {
    content: string
    imgSrc: string
  }

  const [_, summary, ...body] = content.split("---")

  const title = /.*title:\s+(.*)/.exec(summary)?.[1]
  const categories =
    /.*categories:\s+\[(.*)\]/.exec(summary)?.[1]?.split(",") ?? []
  const keywords = /.*keywords:\s+\[(.*)\]/.exec(summary)?.[1]?.split(",") ?? []
  const date = /.*date:\s+(.*)/.exec(summary)?.[1]

  const html = md.render(body.join())

  return (
    <>
      <article className="article-layout pb-8">
        <img src={imgSrc} alt="image" className="article-image"></img>
        <h1 className="headline mt-4">{title}</h1>
        <div className="tags mt-4">
          {categories.map((t) => {
            const tag = t.replaceAll('"', "")
            return (
              <span className="tag label" key={tag}>
                {tag}
              </span>
            )
          })}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="markdown-body p-1 body is-background mt-16"
        ></div>
      </article>
    </>
  )
}

export { BlogPage as default, getBlogsLoader }
