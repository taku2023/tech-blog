import "@/styles/all.scss"
import "material-symbols"
import React from "react"
import ReactDOM from "react-dom/client"
import { HelmetProvider } from "react-helmet-async"
import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./hooks/useThemeProvider"
import "./main.scss"
import router from "./route"

ReactDOM.createRoot(document.getElementById("body") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
)
