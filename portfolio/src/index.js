import React from "react";
import ReactDOM from "react-dom";
import { plugins } from "glamor";
import App from "./App";
import "./icons";

import "normalize.css";

plugins.add(specific);
function specific({ selector, style }) {
  const newSelector = selector
    .split(",")
    .map(s => `body ${s}`)
    .join(",");
  return { selector: newSelector, style };
}

ReactDOM.render(<App />, document.getElementById("root"));
