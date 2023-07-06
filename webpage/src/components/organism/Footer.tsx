import pic from "@/static/github-mark.svg"
import { Link } from "react-router-dom"
import { HashLink } from "react-router-hash-link"
import "./Footer.scss"

const Footer = () => {
  return (
    <>
      <footer id="footer">
        <div className="contact">
          <p className="body mb-1">Contact</p>
          <label>
            <Link
              to={"job-offer"}
              className="label text-no-decoration is-clickable"
            >
              Offer Jobs
            </Link>
          </label>
          <label>
            <a
              href="https://buymeacoffee.com/moritakuaki"
              className="text-no-decoration label"
            >
              Buy me a coffee
            </a>
          </label>
        </div>
        <div className="about">
          <p className="body mb-1">About Me</p>
          <span className="label">
            <HashLink
              to={"about-me#profile"}
              className="text-no-decoration label"
            >
              profile
            </HashLink>
          </span>
          <span>
            <HashLink
              to={"about-me#resume"}
              className="text-no-decoration label"
            >
              resume
            </HashLink>
          </span>
        </div>
        <div>
          <span>
            <img src=""></img>
          </span>
        </div>
        <hr className="my-1 bg-light"></hr>
        <div className="author">
          <div>
            <p className="label">
              This site is created using <a href="https://react.dev/">React</a>
            </p>
            <span className="caption">&copy;Takuaki Mori</span>
          </div>
          <div className="author-sns-links">
            <a href="https://github.com/taku2023">
              <img src={pic} className="icon is-small is-clickable"></img>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
