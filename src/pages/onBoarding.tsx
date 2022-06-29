import { FC } from "react";
import styled from "styled-components";

import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import CardAsLink from "../components/Card/CardAsLink";
import CardTitle from "../components/Card/CardComponents/CardTitle";
import { P } from "../components/Typography";

const OnBoardingLayout = styled(Grid)`
  max-width: 1200px;
  margin: auto;
  background: grey;
`;

const OnBoarding: FC = () => {
  return (
    <OnBoardingLayout>
      <GridArea gridColumnStart={[0, 0, 3]} colSpan={[12, 6, 6]}>
        <CardAsLink mh={8} background={"white"} href={""} ariaLabel={""}>
          <CardTitle title={"Teacher"} tag={"h2"}></CardTitle>
          <P>Short snappy description of what this card is about.</P>
        </CardAsLink>
      </GridArea>
      <GridArea gridColumnStart={[0, 0, 5]} colSpan={[12, 6, 3]}>
        <CardAsLink mh={8} background={"white"} href={""} ariaLabel={""}>
          <CardTitle title={"Pupil"} tag={"h2"}></CardTitle>

          <P>Short snappy description of what this card is about.</P>
        </CardAsLink>
      </GridArea>
    </OnBoardingLayout>
  );
};

export default OnBoarding;
