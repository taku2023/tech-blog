import pic from "@/static/github-mark.svg"
import { Link } from "react-router-dom"
import "./Footer.scss"

const Footer = () => {
  return (
    <>
      <footer id="footer">
        <div className="contact">
          <p className="body mb-1">Contact Me</p>
          <label className="label">Offer Jobs</label>
          <label className="label">Support me</label>
        </div>
        <div className="about">
          <p className="body mb-1">About Me</p>
          <span className="label">profile</span>
          <span className="label">
            <Link to={"about-me#resume"} className="text-no-decoration">
              resume
            </Link>
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
            <p className="body is-bold">Freelance Engineer</p>
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
