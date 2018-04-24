import React, { Component, Fragment } from "react";
import glamorous, { Div } from "glamorous";
import Hero from "components/hero";
import Section from "components/section";
import { H1, P } from "components/typography";
import Icon from "@fortawesome/react-fontawesome";

const HeroContent = glamorous.div({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
});

const SkillRow = glamorous.div({
  marginTop: ".8rem",
  display: "flex",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
  borderRadius: "3.2rem"
});

const Skill = glamorous(Icon)(({ color }) => ({
  padding: ".4rem 1rem",
  fontSize: "2.4rem",
  color
}));

class HomePage extends Component {
  render() {
    return (
      <Fragment>
        <Hero>
          <HeroContent>
            <H1 boxed capitalized color="white" marginTop="6rem">
              Luke Harris
            </H1>
            <P color="white" marginTop=".8rem">
              Web developer · Peterborough · UK
            </P>
            <SkillRow>
              <Skill color="#61dafb" icon={["fab", "react"]} />
              <Skill color="#f06529" icon={["fab", "html5"]} />
              <Skill color="#32a9dd" icon={["fab", "css3"]} />
            </SkillRow>
          </HeroContent>
        </Hero>
        <Section title="About Me">
          <P>TODO</P>
        </Section>
      </Fragment>
    );
  }
}

export default HomePage;
