import { FC } from "react";
import { OakTypography } from "@oaknational/oak-components";

import type { Card as CardShape } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import useAnalytics from "@/context/Analytics/useAnalytics";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Card from "@/components/SharedComponents/Card";
import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

type HomeSidebarTextCard = CardShape;

const HomeHelpCard: FC<HomeSidebarTextCard> = (props) => {
  const { track } = useAnalytics();

  return (
    <Card $ph={[16, 24]} $borderRadius={0} $background="white">
      <CardTitle icon="search" $iconPosition="leading" iconSize={32} tag="h2">
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
