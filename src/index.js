// ──────────────────────────────────────────────────────────────
//  Entrypoint: renders <App/> into the root DOM node.
//  CRA handles <StrictMode> and service workers by default.
// ──────────────────────────────────────────────────────────────
// App entrypoint
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(<App />);

