import { Link } from "react-router-dom"
const NotFound = () => {
  return (
    <div className="mt-10 text-center">
      <p className="headline">Sorry, Not Found </p>
      <div className="title mt-10">
        Go back to <Link to={"/"}>Top Page</Link>
      </div>
    </div>
  )
}

export default NotFound
