import Thumbnail from "@/components/organism/Thumbnail"
import data from "@/data/mock.json"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import "./Top.sass"

const Top = () => {
  return (
    <>
      <main className="top-container bg-accent">
        <h1 className="headline">Write code as everyone can understand.</h1>
        <p className="title mt-1">
          Blog about software architecture, test, readability.
        </p>
        <div className="mt-4">
          <label className="subtitle">
            <span className="vertical-line"></span> Weekly contents
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
