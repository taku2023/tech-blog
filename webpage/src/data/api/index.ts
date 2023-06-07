import axios from "axios"

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  responseType: "json",
})

export { client }
