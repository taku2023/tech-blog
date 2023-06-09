import Article, { getArticleLoader } from "@/pages/Article"
import Top from "@/pages/Top"
import { createBrowserRouter } from "react-router-dom"
import HeaderLayout from "./components/template/HeaderLayout"

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
        path: "/articles/:id",
        loader: getArticleLoader,
        element: <Article />,
      },
    ],
  },
])

export default router
