import { FC } from "react";
import { OakHeading, OakP, OakSpan } from "@oaknational/oak-components";

import { HomePageNotification } from "@/common-lib/cms-types";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import Icon from "@/components/SharedComponents/Icon";
import CardLink from "@/components/SharedComponents/Card/CardLink";
import Card from "@/components/SharedComponents/Card";
import Box from "@/components/SharedComponents/Box";

type HomeNotificationProps = {
  notification: HomePageNotification;
};

const HomeNotification: FC<HomeNotificationProps> = ({ notification }) => {
  const { track } = useAnalytics();

  if (!notification.enabled) {
    return null;
  }

  const href = getLinkHref(notification.link);

  return (
    <Card
      $background="white"
      $flexGrow={0}
      $transform={[undefined, "rotate(2deg)"]}
      $pa={16}
      $pr={[0, 48]}
      $dropShadow="notificationCard"
    >
      <BoxBorders gapPosition="rightTop" />
      <Box
        $position="absolute"
        $top={0}
        $left={0}
        $transform="translate(-40%,-40%)"
      >
        <Icon name="bell" $background="oakGreen" variant="brush" size={30} />
      </Box>

      <OakSpan $font={["body-4", "body-3"]} $color="grey60">
        {notification.label}
      </OakSpan>
      <OakHeading
        $font={["heading-7", "heading-6"]}
        tag="h2"
        $mt="space-between-sssx"
      >
        <CardLink
          page={null}
          href={href}
          $hoverStyles={["underline-link-text"]}
          htmlAnchorProps={{
            onClick: () =>
              track.notificationSelected({
                linkUrl: href,
                notificationHeadline: notification.heading,
              }),
          }}
        >
          {notification.heading}
        </CardLink>
      </OakHeading>
      <OakP $font={["body-4", "body-2"]} $mt="space-between-sssx">
        {notification.subheading}
      </OakP>
    </Card>
  );
};

export default HomeNotification;
