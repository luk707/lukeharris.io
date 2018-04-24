import glamorous from "glamorous";

export const baseStyles = {
  fontFamily: "'Open Sans', sans-serif",
  margin: 0,
  display: "inline-block"
};

export const boxed = ({ boxed = false, color }) =>
  boxed && {
    padding: "8px",
    borderWidth: "6px",
    borderStyle: "solid",
    borderColor: color
  };

export const capitalized = ({ capitalized = false }) =>
  capitalized && {
    textTransform: "uppercase"
  };

export const color = ({ color = "black" }) => ({ color });

export const h1Styles = {
  fontWeight: 800,
  fontStyle: "italic",
  fontSize: "36px"
};

export const H1 = glamorous("h1", { propsAreCssOverrides: true })(
  baseStyles,
  boxed,
  capitalized,
  color,
  h1Styles
);

export const h2Styles = {
  fontWeight: 700,
  fontSize: "24px"
};

export const H2 = glamorous("h2", { propsAreCssOverrides: true })(
  baseStyles,
  boxed,
  capitalized,
  color,
  h2Styles
);

export const pStyles = {
  fontSize: "16px"
};

export const P = glamorous("p", { propsAreCssOverrides: true })(
  baseStyles,
  color,
  pStyles
);
