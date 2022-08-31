import { FC } from "react";

import useAnalytics from "../../../context/Analytics/useAnalytics";
import ButtonAsLink from "../../Button/ButtonAsLink";
import Card from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import { P } from "../../Typography";

const HomeAboutCard: FC = () => {
  const { track } = useAnalytics();

  return (
    <Card $borderRadius={0} $background="white">
      <CardTitle icon="Search" iconPosition="leading" iconSize={32} tag="h2">
        About us
      </CardTitle>
      <P color={"black"} fontSize={16} $mb={24}>
        Discover who we are, what we do and how we work.
      </P>
      <ButtonAsLink
        $mt={"auto"}
        fullWidth
        href="/about-us/who-we-are"
        label="Find out more"
        htmlAnchorProps={{ onClick: track.aboutSelected }}
      />
    </Card>
  );
};

export default HomeAboutCard;
