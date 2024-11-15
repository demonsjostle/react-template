import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./Main";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

const render = (Component: React.FC) => {
  root.render(<Component />);
};

render(Main);

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept("./Main", () => {
    const NextMain = require("./Main").default;
    render(NextMain);
  });
}
