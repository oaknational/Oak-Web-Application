import { FC } from "react";
import { PortableText } from "@portabletext/react";

import ButtonAsLink from "../../Button/ButtonAsLink";
import type { Card as CardShape } from "../../../node-lib/cms";
import Card from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import Typography from "../../Typography";
import { getCTAHref } from "../../../utils/portableText/resolveInternalHref";

type HomeSidebarTextCard = CardShape;

const HomeHelpCard: FC<HomeSidebarTextCard> = (props) => {
  return (
    <Card $ph={[16, 24]} $borderRadius={0} $background="white">
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
          // @TODO: This link is dynamic, not always a support link
          // so we may not always want to open it in a new tab
          // See owa issue #619
          // When this is standardized remove the exclusions from sonar
          htmlAnchorProps={{ target: "_blank" }}
        />
      )}
    </Card>
  );
};

export default HomeHelpCard;
