import HeaderLayout from "@/components/template/HeaderLayout"
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
        path: "/blogs/:id",
        loader: getBlogsLoader,
        element: <Blog />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
])

export default router
