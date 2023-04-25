import { FC } from "react";

import Card from "../../Card";
import { Heading, P, Span } from "../../Typography";
import CardLink from "../../Card/CardLink";
import Box from "../../Box";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import Icon from "../../Icon";
import useAnalytics from "../../../context/Analytics/useAnalytics";

const HomeNotification: FC = () => {
  const { track } = useAnalytics();
  const href = "/blog/help-shape-oak";
  const heading = "Help shape Oak";
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
        <Icon
          name="bell"
          $background="pupilsHighlight"
          variant="brush"
          size={30}
        />
      </Box>
      <Span $font={["body-4", "body-3"]} $color="oakGrey4">
        Blog
      </Span>
      <Heading $font={["heading-7", "heading-6"]} tag="h2" $mt={4}>
        <CardLink
          page={null}
          href={href}
          $hoverStyles={["underline-link-text"]}
          htmlAnchorProps={{
            onClick: () =>
              track.notificationSelected({
                linkUrl: href,
                notificationHeadline: heading,
              }),
          }}
        >
          {heading}
        </CardLink>
      </Heading>
      <P $font={["body-4", "body-2"]} $mt={4}>
        Find out more
      </P>
    </Card>
  );
};

export default HomeNotification