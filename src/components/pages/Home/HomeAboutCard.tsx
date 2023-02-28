import { FC } from "react";
import { PortableText } from "@portabletext/react";

import useAnalytics from "../../../context/Analytics/useAnalytics";
import ButtonAsLink from "../../Button/ButtonAsLink";
import type { Card as CardShape } from "../../../common-lib/cms-types";
import Card from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import Typography from "../../Typography";
import { getCTAHref } from "../../../utils/portableText/resolveInternalHref";

type HomeSidebarTextCard = CardShape;

const HomeAboutCard: FC<HomeSidebarTextCard> = (props) => {
  const { track } = useAnalytics();

  return (
    <Card $ph={[16, 24]} $borderRadius={0} $background="white">
      <CardTitle icon="search" $iconPosition="leading" iconSize={32} tag="h2">
        {props.title}
      </CardTitle>

      <Typography $font={"body-2"} $mb={24}>
        <PortableText value={props.bodyPortableText} />
      </Typography>

      {props.cta && (
        <ButtonAsLink
          $mt={"auto"}
          $fullWidth
          page={null}
          href={getCTAHref(props.cta)}
          label={props.cta.label}
          // @TODO: This link is dynamic, not always an about link
          // so tracking may become incorrect
          // See owa issue #619
          // When this is standardized remove the exclusions from sonar
          htmlAnchorProps={{ onClick: track.aboutSelected }}
        />
      )}
    </Card>
  );
};

export default HomeAboutCard;
