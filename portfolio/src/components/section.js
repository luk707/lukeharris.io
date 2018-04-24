import React from "react";
import glamorous from "glamorous";
import { H2 } from "./typography";

const Section = glamorous.section(({ theme, offWhite }) => ({
  backgroundColor: offWhite ? theme.colorOffWhite : theme.colorLight,
  padding: "3.2rem 2.8rem"
}));

const Divider = glamorous.div(({ theme }) => ({
  height: ".2rem",
  width: "3.5rem",
  backgroundColor: theme.colorPrimary,
  marginBottom: "1.2rem"
}));

export default ({ children, title, offWhite = false }) => (
  <Section offWhite={offWhite}>
    <H2>{title}</H2>
    <Divider />
    {children}
  </Section>
);
