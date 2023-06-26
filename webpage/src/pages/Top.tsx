import { Avatar } from "@/components/atom/Avatar"
import Thumbnail from "@/components/organism/Thumbnail"
import data from "@/data/mock.json"
import dayjs from "dayjs"
import { Link } from "react-router-dom"
import "./Top.scss"

const Top = () => {
  return (
    <>
      <div className="top layout-top py-8">
        <h1 className="headline">
          Hello, I am Taku. Curious enginner working as frontend dev.
        </h1>
        <div className="p-1 my-6">
          <TopProfile></TopProfile>
          <p className="body p-1 my-4">
            Hello, I am frontend developer curious about readability,
            testability, architecure. I have been working in Japan for 8 years
            as enginner and tech consultant. For more information, go{" "}
            <Link to="/about-me" className="link">
              About me
            </Link>
          </p>
        </div>
        <div className="mt-4">
          <label className="subtitle">Latest Blogs</label>
          <ul className="thumbnails">
            {data.thumbnails.map((prop) => {
              const postAt = dayjs(prop.postAt)
              const props = { ...prop, postAt }
              return <Thumbnail {...props} key={props.id}></Thumbnail>
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

const TopProfile = () => {
  return (
    <div className="top-profile">
      <div className="top-profile-image">
        <Avatar></Avatar>
      </div>
      <div className="top-profile-description">
        <p className="title">Takuaki Mori</p>
        <p className="top-profile-description label mt-1 text-wrap">
          <span className="is-mini">
            I love to follow SOLID principal, write clean code.
            <br />
          </span>
          Vue/React/Typescript/AWS/Android/Nodejs/Go/Kotlin/Elixir
        </p>
      </div>
    </div>
  )
}

export default Top
