import avatar from "@/static/avatar.jpg"
import "./Avatar.scss"

export const Avatar = () => {
  return (
    <>
      <img
        src={avatar}
        alt="avatar"
        className="avatar border border-round border-active"
      ></img>
    </>
  )
}
