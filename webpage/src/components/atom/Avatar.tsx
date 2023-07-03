import "./Avatar.scss"

interface Props {
  src?: string
}

export const Avatar = (props: Props) => {
  return (
    <>
      <img
        src={props.src ?? "https://bulma.io/images/placeholders/128x128.png"}
        alt="avatar"
        className="avatar border border-round border-active"
      ></img>
    </>
  )
}
