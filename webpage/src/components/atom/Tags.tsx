import "./Tags.scss"

interface Props {
  tags: string[]
  onClick?: (tag: string) => {}
}

const Tags = (props: Props) => {
  return (
    <span className="tags">
      {props.tags.map((value, i) => {
        return (
          <span
            className="tag label"
            key={i}
            onClick={(_) => props.onClick?.(value)}
          >
            {value}
          </span>
        )
      })}
    </span>
  )
}

export default Tags
