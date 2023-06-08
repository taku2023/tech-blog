import Header, { useHeaderExpandState } from "@/components/organism/Header"
import Footer from "@/components/organism/Footer"
import { Outlet } from "react-router-dom"

const HeaderLayout = () => {
  const { expand,clickMenu,reset } = useHeaderExpandState()

  return (
    <>
      <Header clickMenu={clickMenu} expand={expand}/>
      <main
        onClick={(_) => {
          console.log("click outside")
          reset()
        }}
      >
        <Outlet />
      </main>
      <Footer></Footer>
    </>
  )
}

export default HeaderLayout
