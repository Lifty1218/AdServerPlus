import React from "react";
import ReactDOM from "react-dom/client";
import { ContextProvider } from "./context/context";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import router from "./routes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);
