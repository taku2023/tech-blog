import HeaderLayout from "@/components/template/HeaderLayout"
import About from "@/pages/About"
import Blog, { getBlogsLoader } from "@/pages/Blog"
import NotFound from "@/pages/NotFound"
import Top from "@/pages/Top"
import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderLayout />,
    children: [
      {
        index: true,
        element: <Top />,
      },
      {
        path: "blogs/:key",
        loader: getBlogsLoader,
        element: <Blog />,
      },
      {
        path: "about-me",
        element: <About />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])

export default router
