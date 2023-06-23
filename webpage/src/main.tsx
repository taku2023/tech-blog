import "@/styles/all.scss"
import "material-symbols"
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import router from "./route"
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div id="theme" className="theme-light">
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
)
