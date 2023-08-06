import { ToolTip } from "@/components/atom/ToolTip"
import { download } from "@/data/api/blogs"
import md from "@/libs/markdown/converter"
import * as dayjs from "dayjs"
import "github-markdown-css"
import { LoaderFunction } from "react-router"
import { useLoaderData } from "react-router-dom"
import "./Blog.scss"

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

  const [_, summary, ...bodies] = content.split("---")

  const title = /.*title:\s+(.*)/.exec(summary)?.[1]
  const categories =
    /.*categories:\s+\[(.*)\]/.exec(summary)?.[1]?.split(",") ?? []
  const description = /.*description:\s+(.*)/.exec(summary)?.[1]
  //const keywords = /.*keywords:\s+\[(.*)\]/.exec(summary)?.[1]?.split(",") ?? []
  const date = /.*date:\s+(.*)/.exec(summary)?.[1]

  const body = bodies.join()
  const html = md.render(body)
  const day = dayjs(date).format("MMMM D,YYYY")
  const words = body.split(" ") // split by space
  const readMinutes = Math.max(Math.round(words.length / 200), 1)

  const shareBlog: React.MouseEventHandler<HTMLSpanElement> = async (e) => {
    e.preventDefault()
    if (!window.navigator.share) {
      await window.navigator.clipboard.writeText(window.location.href)
    } else {
      window.navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      })
    }
  }

  const copyURL: React.MouseEventHandler<HTMLSpanElement> = async (_) => {
    await window.navigator.clipboard.writeText(window.location.href)
  }

  return (
    <>
      {/**META TAG for social website*/}
      <meta name="title" content={title}></meta>
      <meta name="description" content={description}></meta>
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imgSrc} />

      <article className="article-layout pb-8">
        <img src={imgSrc} alt="image" className="article-image"></img>
        <h1 className="headline-sm mt-4">{title}</h1>
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
        <div className="article-supplement mt-4">
          <label className="label">{day}</label>
          <label className="label">・Read {readMinutes}min</label>
          <span className="buttons ml-auto">
            <ToolTip content="URL Copied!">
              <span
                className="material-symbols-outlined icon is-clickable"
                id="copyUrl"
                onMouseDown={copyURL}
              >
                link
              </span>
            </ToolTip>
            <span
              className="material-symbols-outlined icon is-clickable"
              onClick={shareBlog}
            >
              share
            </span>
          </span>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className="markdown-body p-1 body is-background mt-8"
        ></div>
      </article>
    </>
  )
}

export { BlogPage as default, getBlogsLoader }
