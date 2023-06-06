import Top from "@/pages/Top";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: Top(),
  },
]);

export default router;
