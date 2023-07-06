import { Avatar } from "@/components/atom/Avatar"
import Thumbnail from "@/components/organism/Thumbnail"
import { Summary, getLatestBlogs } from "@/data/api/blogs"
import data from "@/data/mock.json"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./Top.scss"

const Top = () => {
  const [blogs, setBlogs] = useState<Summary[]>([])

  useEffect(() => {
    getLatestBlogs().then(({ blogs }) => {
      console.log(blogs)
      setBlogs((_) => blogs)
    })
  }, [])

  return (
    <>
      <div className="top top-layout py-8">
        <h1 className="headline">
          Hello, I am Taku. Curious enginner working as frontend dev.
        </h1>
        <div className="p-1 my-8">
          <TopProfile></TopProfile>
          <p className="body p-1 my-4">
            Hello, I am frontend developer curious about readability,
            testability, architecure. I have been working in Japan for 8 years
            as enginner and tech consultant. For more information, go{" "}
            <Link to={`about-me`} className="link">
              About me
            </Link>
          </p>
        </div>
        <div className="mt-4">
          <label className="subtitle">Latest Blogs</label>
          <ul className="thumbnails">
            {blogs.map((props) => {
              return <Thumbnail dir={props.s3_dir} title={props.title} categories={props.categories} key={props.s3_dir}></Thumbnail>
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
          Vue/React/Typescript/AWS/Android/Nodejs/Go/Kotlin
        </p>
      </div>
    </div>
  )
}

export default Top
