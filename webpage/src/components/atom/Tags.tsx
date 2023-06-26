import "./Tags.scss"

interface Props {
  tags: string[]
}

const Tags = (props: Props) => {
  return (
    <span className="tags">
      {props.tags.map((value, i) => {
        return (
          <span className="tag label" key={i}>
            {value}
          </span>
        )
      })}
    </span>
  )
}

export default Tags
