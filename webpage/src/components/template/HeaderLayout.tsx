import Footer from "@/components/organism/Footer"
import Header from "@/components/organism/Header"
import { Outlet } from "react-router-dom"

const HeaderLayout = () => {
  return (
    <>
      <Header />
      <main id="main" className="is-background">
        <Outlet />
      </main>
      <Footer></Footer>
    </>
  )
}

export default HeaderLayout
