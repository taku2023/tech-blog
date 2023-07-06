import Tags from "@/components/atom/Tags"
import { useNavigate } from "react-router"
import "./Thumbnail.scss"

type Props = {
  dir: string
  title: string
  categories: string[]
}

const Thumbnail = (props: Props) => {
  const imgSrc = `${location.hostname}/__blogs__/${props.dir}/images/banner.png`
  const nav = useNavigate()

  return (
    <article
      className="thumbnail is-clickable"
      onClick={(e) => {
        e.preventDefault()
        nav(`blogs/${props.dir}`)
      }}
    >
      <img
        src={imgSrc}
        className="thumbnail-image"
      ></img>
      <div className="thumbnail-title">
        <p className="subtitle text-wrap">{props.title}</p>
        <p className="thumbnail-title-footer mt-2">
          {/*<span className="caption">
            <span className="icon material-symbols-outlined">lock</span>
            {props.minutes}min
        </span>*/}
          <Tags tags={props.categories}></Tags>
        </p>
      </div>
    </article>
  )
}

export default Thumbnail
