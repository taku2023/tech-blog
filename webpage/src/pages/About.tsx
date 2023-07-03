import { Avatar } from "@/components/atom/Avatar"
import about from "@/data/about.json"
import { useState } from "react"
import "./About.scss"

const About = () => {
  type Tab = "project" | "language"
  const [tab, setTab] = useState<Tab>("project")

  return (
    <div className="about-layout">
      <p className="headline text-center mt-10">About Me</p>
      <p className="label text-center mt-4">I'm developer</p>
      <section className="mt-6 section">
        <p className="body">
          Thank you for visiting here, I hope you'll get interested of me.
          Before you see the whole contents below, here is the list below what I
          can offer.
        </p>
        <ul className="list mt-4 text-indent body">
          <li>1.Create web application from scratch.</li>
          <li>2.Code review of your repository and give some advise.</li>
          <li>3.Design web application with figma.</li>
          <li>4.Be your mentor if you are seeking for teacher online.</li>
        </ul>
      </section>
      <div className="my-16 about-profile text-center">
        <p className="title text-center mt-4">I'm Takuaki Mori</p>
        <figure placeholder="avatar" className="my-6 text-center">
          <Avatar></Avatar>
        </figure>
        <div>
          <ul className="about-profile-labels">
            <li>
              <span className="icon material-symbols-outlined">home_pin</span>
              <span className="label ml-2">Japan, ibaraki</span>
            </li>
            <li>
              <span className="icon material-symbols-outlined">mail</span>
              <span className="label ml-2">chocomintcocktail@gmail.com</span>
            </li>
            <li>
              <img
                src="/src/static/github-mark.svg"
                className="icon is-small"
              ></img>
              <span className="label ml-2">github.com/taku2023</span>
            </li>
          </ul>
          <article className="my-8 mx-2 about-summary">
            <p className="body">
              Software Enginner with 8+ years of experience as FrontEnd and
              Android enginner. I love to build software from scratch, and work
              mainly B2C service. I longly work on code refactor and since I
              getting to know more about readability, testability and
              architecture.
            </p>
            <div className="mt-8">
              <p className="subtitle">I worked as</p>
              <ul className="body mt-4">
                <li>Android enginner for 3+ years</li>
                <li>Frontend enginner for 2+ years</li>
                <li>Technical Consultant B2C service company for 2+ years</li>
                <li>AWS enginner for 1 year</li>
              </ul>
            </div>
            <div className="mt-8">
              <p className="subtitle">My skill is</p>
              <ul className="body mt-4">
                <li>Vue.js/React with typescript</li>
                <li>Android with Kotlin/Java</li>
                <li>API Server with Go</li>
                <li>Serverless Architecture with AWS</li>
                <li>Web Server with Nodejs/Express</li>
                <li>Web design with figma</li>
              </ul>
            </div>
          </article>
          <div></div>
        </div>
      </div>
      <div className="about-resume my-16" id="resume">
        <p className="title text-center">My Resume</p>
        <div className="my-6">
          <ul className="tabs is-center mb-4">
            <li
              className={`tab ${tab == "project" ? "is-active" : ""}`}
              onClick={(_) => setTab((_) => "project")}
            >
              Project
            </li>
            <li
              className={`tab ${tab == "language" ? "is-active" : ""}`}
              onClick={(_) => setTab((_) => "language")}
            >
              Language
            </li>
          </ul>
          <section className="section">
            <ul>
              {tab == "project" ? (
                about.projects.map((props, index) => (
                  <Project {...props} key={index}></Project>
                ))
              ) : tab == "language" ? (
                about.languages.map((props, index) => (
                  <Language {...props} key={index}></Language>
                ))
              ) : (
                <></>
              )}
            </ul>
          </section>
        </div>
      </div>
      {/*<div className="about-history">
        <p className="title text-center">My History</p>
        <div className="my-6">
          <div className="about-history__content about-history__content--right text-center">
            <label className="label">2015-2019</label>
            <img
              src="https://bulma.io/images/placeholders/128x128.png"
              className="border-round  about-history__content__img"
            ></img>
            <p className="body">
              Enroll University of Tokyo.
              <br />
              Major in physics. Enroll University of Tokyo.
              <br />
              Major in physics. Enroll University of Tokyo.
              <br />
              Major in physics. Enroll University of Tokyo.
              <br />
              Major in physics. Enroll University of Tokyo.
              <br />
              Major in physics.
            </p>
          </div>
          <div className="about-history__content about-history__content--left text-center">
            <label className="label">2015-2019</label>
            <img
              src="https://bulma.io/images/placeholders/128x128.png"
              className="border-round  about-history__content__img"
            ></img>
            <p className="body">
              Enroll University of Tokyo.
              <br />
              Major in physics.
            </p>
          </div>
        </div>
            </div>*/}
      <div className="about-hobby my-16">
        <p className="title text-center">My hobbies</p>

        <div className="about-hobby__grid">
          {about.hobiies.map((hobby) => {
            return (
              <div key={hobby.title} className="mt-4">
                <p className="subtitle">{hobby.title}</p>
                <p className="body mb-4">{hobby.subtitle}</p>
                {hobby.list.map((item) => {
                  return (
                    <p key={item} className="body">
                      {item}
                    </p>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default About

const Project = (props: {
  title: string
  dates: {
    from: string
    to: string
  }
  description: string
  tags: string[]
}) => {
  return (
    <>
      <li className="mt-4">
        <p className="caption">
          <span>{props.dates.from}</span>
          <span>-</span>
          <span>{props.dates.to}</span>
        </p>
        <p className="subtitle my-1">{props.title}</p>
        <p className="subbody">{props.description}</p>
        <div className="my-1">
          {props.tags.map((tag) => {
            return (
              <span className="label" key={tag}>
                #{tag}
              </span>
            )
          })}
        </div>
      </li>
    </>
  )
}

const Language = (props: { title: string; description: string }) => {
  return (
    <>
      <li className="mt-4">
        <p className="subtitle my-1"> {props.title}</p>
        <p className="subbody">{props.description}</p>
      </li>
    </>
  )
}

/*const History = (props: { year: string; src: string; description: string }) => {
  return (
    <>
      <div className="about-history__content about-history__content--right text-center">
        <label className="label">{props.year}</label>
        <img
          src={props.src ?? "https://bulma.io/images/placeholders/128x128.png"}
          className="border-round  about-history__content__img"
        ></img>
        <p className="body">{props.description}</p>
      </div>
    </>
  )
}*/

const Hobby = (props: { title: string; list: string[] }) => {
  return (
    <>
      <p className="subtitle text-center">{props.title}</p>
      {props.list.map((item) => {
        return <p className="subbody text-center">{item}</p>
      })}
    </>
  )
}
