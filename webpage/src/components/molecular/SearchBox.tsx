import InputOutlined from "@/components/molecular/InputOutlined"
import { search, type Summary } from "@/data/api/blogs"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./SearchBox.scss"

const SearchBox = () => {
  const zero: Readonly<{
    blogs: Summary[]
  }> = {
    blogs: [],
  }

  const [text, setText] = useState("")
  const [result, setResult] = useState(zero)

  const fetch = async (text: string) => {
    if (text.length == 0) {
      setResult(zero)
    } else {
      const result = await search({search: text})
      setResult(result)
    }
  }

  useEffect(() => {
    fetch(text)
  }, [text])

  return (
    <>
      <InputOutlined state={[text, setText]}></InputOutlined>
      <div className="search-list mt-2">
        <>
          <label className="label">RESULT: {result.blogs.length} blogs</label>
          {result.blogs.map((blog, i) => {
            return (
              <Link
                className="search-list-item body text-no-decoration"
                key={i}
                to={`blogs/${blog.object_key}`}
              >
                {blog.title} | {blog.object_key}
              </Link>
            )
          })}
        </>
      </div>
    </>
  )
}

export default SearchBox
