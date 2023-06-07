import axios from "axios";

console.log(import.meta.env.VITE_BASE_URL);

const client = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  responseType: "json",
});

export { client };
