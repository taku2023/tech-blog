import "./Footer.scss"
import pic from "@/static/github-mark.svg"

const Footer = () => {
  return (
    <>
      <footer id="footer" className="bg-light">
        <div className="contact">
          <p className="body mb-1">Contact Me</p>
          <label className="label">Offer Jobs</label>
          <label className="label">Support me</label>
        </div>
        <div className="about">
          <p className="body mb-1">About Me</p>
          <span className="label">profile</span>
          <span className="label">skills</span>
          <span className="label">works</span>
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
            <a href="https://github.com/taku2023" className="">
              <img src={pic} className="icon is-small"></img>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
