import "./Avatar.scss"

interface Props {
  src?: string
}

export const Avatar = (props: Props) => {
  return (
    <>
      <img
        src={props.src ?? "src/static/avatar.jpg"}
        alt="avatar"
        className="avatar border border-round border-active"
      ></img>
    </>
  )
}
