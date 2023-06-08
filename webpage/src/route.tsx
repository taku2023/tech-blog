import Top from "@/pages/Top"
import Article, { getArticleLoader } from "@/pages/Article"
import { createBrowserRouter } from "react-router-dom"
import { get } from "./data/api/articles"
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
