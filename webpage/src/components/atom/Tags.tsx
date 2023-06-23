import "./Tags.scss"

interface Props {
  tags: string[]
}

const Tags = (props: Props) => {
  return (
    <div className="tags">
      {props.tags.map((value) => {
        return <span className="tag label">{value}</span>
      })}
    </div>
  )
}

export default Tags
