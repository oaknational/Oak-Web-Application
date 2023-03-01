import { FC } from "react";
import { PortableText } from "@portabletext/react";

import ButtonAsLink from "../../Button/ButtonAsLink";
import type { Card as CardShape } from "../../../common-lib/cms-types";
import Card from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import Typography from "../../Typography";
import { getCTAHref } from "../../../utils/portableText/resolveInternalHref";
import useAnalytics from "../../../context/Analytics/useAnalytics";

type HomeSidebarTextCard = CardShape;

const HomeHelpCard: FC<HomeSidebarTextCard> = (props) => {
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
          // @TODO: This link is dynamic, not always a support link
          // so we may not always want to open it in a new tab
          // See owa issue #619
          // When this is standardized remove the exclusions from sonar
          htmlAnchorProps={{
            onClick: track.helpCentreSelected,
          }}
        />
      )}
    </Card>
  );
};

export default HomeHelpCard;
