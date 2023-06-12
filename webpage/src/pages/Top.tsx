import Thumbnail from "@/components/organism/Thumbnail"
import data from "@/data/mock.json"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import "./Top.sass"

const Top = () => {
  return (
    <>
      <main className="top-container">
        <h1 className="headline my-4">Hi! I'm Takuaki! Motivated developer.</h1>
        <p className="title my-4">
          Keen about software architecture, test, readability.
        </p>
        <div className="author">
          <label className="subtitle">
            <span className="vertical-line"></span> Who am I?
          </label>
          <img src="" className="circle"></img>
          <p className="p-1">
            I am freelance frontend + backend software developer, with knowledge
            of
            <span className="tags body my-1">
              <span className="tag">React</span>
              <span className="tag">Vue</span>
              <span className="tag">TypeScript</span>
              <span className="tag">CSS/SASS</span>
              <span className="tag">AWS</span>
              <span className="tag">Android</span>
              <span className="tag">Kotlin</span>
              <span className="tag">Go</span>
              <span className="tag">Rust</span>
            </span>
            If you interested, see <a className="link">about me.</a>
          </p>
        </div>
        <div className="mt-4">
          <label className="subtitle">
            <span className="vertical-line"></span> Latest Blogs
          </label>
          <ul className="thumbnails">
            {data.thumbnails.map((prop) => {
              const postAt = dayjs(prop.postAt)
              const props = { ...prop, postAt }
              return (
                <Link to={`articles/${props.id}`} key={props.id}>
                  <Thumbnail {...props}></Thumbnail>
                </Link>
              )
            })}
          </ul>
        </div>
      </main>
    </>
  )
}

export default Top
