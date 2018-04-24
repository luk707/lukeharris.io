import glamorous from "glamorous";
import heroBackground from "media/hero.svg";

export default glamorous.div({
  position: "relative",
  minHeight: "15rem",
  paddingBottom: `${2 / 10 * 100}%`,
  background: `url(${heroBackground}) no-repeat center center #222`,
  backgroundSize: "cover"
});
