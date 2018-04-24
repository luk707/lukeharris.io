import React, { Component } from "react";
import { ThemeProvider } from "glamorous";
import HomePage from "pages/home";
import { css } from "glamor";
import Page from "components/page";

const baseTheme = {
  colorLight: "#FFF",
  colorDark: "#222",
  colorOffWhite: "#F8F8F8",
  colorLightGrey: "#F6F6F6",
  colorPrimary: "#A600FD",
  colorPink: "#F100FF",
  colorPurple: "#6100FC"
};

css.global("html, body", { backgroundColor: "#f4f4f4", fontSize: "62.5%" });

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={baseTheme}>
        <Page>
          <HomePage />
        </Page>
      </ThemeProvider>
    );
  }
}

export default App;
