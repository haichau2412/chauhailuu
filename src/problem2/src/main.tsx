import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./app";
import React from "react";

const rootE = document.getElementById("root");

if (rootE) {
  const root = createRoot(rootE);
  root.render(<App />);
}
