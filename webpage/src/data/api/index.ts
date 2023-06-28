import axios from "axios"

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/__api__",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  responseType: "json",
})

const downloadClient = axios.create({
  baseURL: import.meta.env.BASE_URL + "/__blogs__",
  headers: {
    "Content-Type": "text/markdown",
  },
  responseType: "text",
})

export { client, downloadClient }
