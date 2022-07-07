import { FC } from "react";
import styled from "styled-components";

import GridArea from "../../components/Grid/GridArea";
import CardTitle from "../../components/Card/CardComponents/CardTitle";
import { Heading, P } from "../../components/Typography";
import Flex from "../../components/Flex";
import Grid from "../../components/Grid";
import Card from "../../components/Card";
import CardLink from "../../components/Card/CardLink";

const OnBoardingGrid = styled(Grid)`
  max-width: 648px;
`;

const OnBoarding: FC = () => {
  return (
    <Flex
      width={"100%"}
      flexGrow={1}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      background={"grey2"}
    >
      <OnBoardingGrid rg={[16, 0, 0]} cg={16}>
        <GridArea colSpan={[12, 12, 12]}>
          <Heading textAlign={"center"} mb={32} tag="h1" fontSize={32}>
            Use Oak as a:
          </Heading>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card
            justifyContent={"center"}
            alignItems={"center"}
            mh={[24, 0, 0]}
            background={"white"}
          >
            <CardTitle textCenter tag={"h2"}>
              <CardLink href={"/beta/teacher"}>Teacher</CardLink>
            </CardTitle>

            <P textAlign={"center"}>
              Short snappy description of what this card is about.
            </P>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card justifyContent={"center"} mh={[24, 0, 0]} background={"white"}>
            <CardTitle textCenter tag={"h2"}>
              <CardLink href={"/beta/pupil"}>Pupil</CardLink>
            </CardTitle>
            <P textAlign="center">
              Short snappy description of what this card is about.
            </P>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 12, 12]}>
          <P ma={24} textAlign="center">
            If you are not a pupil or a teacher you can still use oak just
            choose teachers or pupils to select a view.
          </P>
        </GridArea>
      </OnBoardingGrid>
    </Flex>
  );
};

export default OnBoarding;
