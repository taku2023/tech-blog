import { Dayjs } from "dayjs"
import "./Thumbnail.sass"

type Props = {
  title: string
  tags: string[]
  minutes: number
  postAt: Dayjs
}

const Thumbnail = (props: Props) => {
  return (
    <article className="thumbnail">
      <img src="" className="thumbnail-image"></img>
      <div className="thumbnail-title">
        <p className="body">{props.title}</p>
        <div className="tags">
          {props.tags.map((tag) => (
            <span className="tag" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
        <p className="thumbnail-title-footer mt-auto">
          <span className="caption ">
            {/*<span className="material-symbols-outlined icon is-small">
              timer
          </span>*/}
            {props.minutes} minutes
          </span>
          <span className="caption">
            Update {props.postAt.format("YY/MM/DD")}
          </span>
        </p>
      </div>
    </article>
  )
}

export default Thumbnail
