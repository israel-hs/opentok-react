import React from "react";
import ReactDOM from "react-dom/client";
// import App from './App.tsx'
// import Video from "./Video";
import Video from "./VideoRefactored";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <Video />
  // </React.StrictMode>
);
