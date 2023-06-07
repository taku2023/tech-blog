import { search } from "@/data/api/articles";
import { useEffect, useRef, useState } from "react";
import "./SearchBox.sass";

const SearchBox = () => {
  const zero: Readonly<{ limit: number; articles: { title: string }[] }> = {
    limit: 0,
    articles: [],
  };

  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    limit: number;
    articles: { title: string }[];
  }>(zero);
  const input = useRef<HTMLInputElement>(null);

  const fetch = async (text: string) => {
    if (text.length == 0) {
      setResult(zero);
    } else {
      const result = await search(text);
      setResult(result);
    }
  };

  useEffect(() => {
    input.current?.focus();
  }, []);

  useEffect(() => {
    fetch(text);
  }, [text]);

  return (
    <>
      <div className="searchbox">
        <input
          ref={input}
          value={text}
          className="input"
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></input>
        <span className="btn-close" onClick={(_) => setText("")}>
          <span className="material-symbols-outlined icon">close</span>
        </span>
      </div>
      <div className="search-list mt-2">
        {result.articles.length == 0 ? (
          <>
            <label className="label">RECENT</label>
            <p className="search-list-item">You should follow here.</p>
          </>
        ) : (
          <>
            <label className="label">RESULT {result.limit}</label>
            {result.articles.map((article, i) => {
              return (
                <p className="search-list-item" key={i}>
                  {article.title}
                </p>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default SearchBox;
