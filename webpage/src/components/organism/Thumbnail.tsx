import Tags from "@/components/atom/Tags"
import { Dayjs } from "dayjs"
import "./Thumbnail.scss"

type Props = {
  title: string
  categories: string[]
  imageSrc: string
  minutes: number
  postAt: Dayjs
}

const Thumbnail = (props: Props) => {
  return (
    <article
      className="thumbnail is-clickable"
      onClick={(_) => {
        //
      }}
    >
      <img
        src={
          props.imageSrc ?? "https://bulma.io/images/placeholders/128x128.png"
        }
        className="thumbnail-image"
      ></img>
      <div className="thumbnail-title">
        <p className="subtitle text-wrap">{props.title}</p>
        <p className="thumbnail-title-footer mt-2">
          <span className="caption">
            <span className="icon material-symbols-outlined">lock</span>
            {props.minutes}min
          </span>
          <Tags tags={props.categories}></Tags>
        </p>
      </div>
    </article>
  )
}

export default Thumbnail
