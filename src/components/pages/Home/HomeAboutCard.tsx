import { FC } from "react";
import { PortableText } from "@portabletext/react";

import useAnalytics from "../../../context/Analytics/useAnalytics";
import ButtonAsLink from "../../Button/ButtonAsLink";
import type { Card as CardShape } from "../../../node-lib/cms";
import Card from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import Typography from "../../Typography";
import { getCTAHref } from "../../../utils/portableText/resolveInternalHref";

type HomeSidebarTextCard = CardShape;

const HomeAboutCard: FC<HomeSidebarTextCard> = (props) => {
  const { track } = useAnalytics();

  return (
    <Card $borderRadius={0} $background="white">
      <CardTitle icon="Search" iconPosition="leading" iconSize={32} tag="h2">
        {props.title}
      </CardTitle>

      <Typography color={"black"} $fontSize={16} $mb={24}>
        <PortableText value={props.bodyPortableText} />
      </Typography>

      {props.cta && (
        <ButtonAsLink
          $mt={"auto"}
          fullWidth
          href={getCTAHref(props.cta)}
          label={props.cta.label}
          // @TODO: This link is dynamic, not always an about link
          // so tracking may become incorrect
          // See owa issue #619
          htmlAnchorProps={{ onClick: track.aboutSelected }}
        />
      )}
    </Card>
  );
};

export default HomeAboutCard;
