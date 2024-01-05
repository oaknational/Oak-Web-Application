import { FC } from "react";

import Card from "../../Card";
import CardTitle from "../../Card/CardComponents/CardTitle";
import Typography from "../../Typography";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import useAnalytics from "@/context/Analytics/useAnalytics";
import type { Card as CardShape } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { PortableTextWithDefaults } from "@/components/PortableText";

type HomeSidebarTextCard = CardShape;

const HomeAboutCard: FC<HomeSidebarTextCard> = (props) => {
  const { track } = useAnalytics();

  return (
    <Card $ph={[16, 24]} $borderRadius={0} $background="white">
      <CardTitle icon="search" $iconPosition="leading" iconSize={32} tag="h2">
        {props.title}
      </CardTitle>

      <Typography $font={"body-2"} $mb={24}>
        <PortableTextWithDefaults
          value={props.bodyPortableText}
          withoutDefaultComponents
        />
      </Typography>

      {props.cta && (
        <ButtonAsLink
          $mt={"auto"}
          $fullWidth
          page={null}
          href={getLinkHref(props.cta)}
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
