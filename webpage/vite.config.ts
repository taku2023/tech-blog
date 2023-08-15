import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@/", replacement: `${__dirname}/src/` }],
  },
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        maintenance: resolve(__dirname, "maintenance.html"),
      },
    },
  },
  appType: "mpa",
})
