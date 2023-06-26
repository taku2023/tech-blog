import InputOutlined from "@/components/molecular/InputOutlined"
import { search } from "@/data/api/articles"
import { useEffect, useState } from "react"
import "./SearchBox.scss"

const SearchBox = () => {
  const zero: Readonly<{
    limit: number
    articles: { title: string; id: string }[]
  }> = {
    limit: 0,
    articles: [],
  }

  const [text, setText] = useState("")
  const [result, setResult] = useState(zero)

  const fetch = async (text: string) => {
    if (text.length == 0) {
      setResult(zero)
    } else {
      const result = await search(text)
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
        {result.articles.length == 0 ? (
          <>
            <label className="label">RECENT</label>
            <p className="search-list-item body">You should follow here.</p>
          </>
        ) : (
          <>
            <label className="label">RESULT {result.limit}</label>
            {result.articles.map((article, i) => {
              return (
                <p className="search-list-item body" key={i}>
                  {article.title}
                </p>
              )
            })}
          </>
        )}
      </div>
    </>
  )
}

export default SearchBox
