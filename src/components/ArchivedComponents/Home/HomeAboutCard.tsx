import { FC } from "react";
import { OakTypography } from "@oaknational/oak-components";

import Card from "@/components/SharedComponents/Card";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import useAnalytics from "@/context/Analytics/useAnalytics";
import type { Card as CardShape } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

type HomeSidebarTextCard = CardShape;

const HomeAboutCard: FC<HomeSidebarTextCard> = (props) => {
  const { track } = useAnalytics();

  return (
    <Card $ph={[16, 24]} $borderRadius={0} $background="white">
      <CardTitle
        icon="search"
        $iconPosition="leading"
        iconSize={"all-spacing-7"}
        tag="h2"
      >
        {props.title}
      </CardTitle>

      <OakTypography $font={"body-2"} $mb="space-between-m">
        <PortableTextWithDefaults
          value={props.bodyPortableText}
          withoutDefaultComponents
        />
      </OakTypography>

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
