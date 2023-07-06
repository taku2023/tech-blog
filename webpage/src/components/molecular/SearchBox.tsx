import InputOutlined from "@/components/molecular/InputOutlined"
import { search, type Summary } from "@/data/api/blogs"
import { useState } from "react"
import { Link } from "react-router-dom"
import "./SearchBox.scss"

const SearchBox = () => {
  const zero: Readonly<{
    blogs: Summary[]
  }> = {
    blogs: [],
  }

  const [result, setResult] = useState(zero)

  const fetch = async (text?: string) => {
    if (!text) {
      return
    } else if (text.length == 0) {
      setResult(zero)
    } else {
      const result = await search({ search: text })
      setResult(result)
    }
  }

  return (
    <>
      <InputOutlined callback={fetch}></InputOutlined>
      <div className="search-list mt-2">
        <>
          <label className="label">RESULT: {result.blogs.length} blogs</label>
          {result.blogs.map((blog, i) => {
            return (
              <Link
                className="search-list-item body text-no-decoration"
                key={i}
                to={`blogs/${blog.s3_dir}`}
              >
                {blog.title}
              </Link>
            )
          })}
        </>
      </div>
    </>
  )
}

export default SearchBox
