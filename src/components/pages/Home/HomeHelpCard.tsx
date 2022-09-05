import { FC } from "react";

import { getHelpUrl } from "../../../common-lib/urls";
import ButtonAsLink from "../../Button/ButtonAsLink";
import Card from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import { P } from "../../Typography";

const HomeHelpCard: FC = () => {
  return (
    <Card $borderRadius={0} $background="white">
      <CardTitle icon="Search" iconPosition="leading" iconSize={32} tag="h2">
        Need some help?
      </CardTitle>
      <P $fontSize={16} $mb={24}>
        Find everything you need to get started and make the most of Oak
        National Academy.
      </P>
      <ButtonAsLink
        $mt={"auto"}
        fullWidth
        href={getHelpUrl()}
        label="Visit help centre"
        htmlAnchorProps={{ target: "_blank" }}
      />
    </Card>
  );
};

export default HomeHelpCard;
