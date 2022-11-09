import { FC } from "react";

import Flex from "../../Flex";
import { Heading, HeadingTag, P } from "../../Typography";
import Box from "../../Box";
import OakImage from "../../OakImage";
import ButtonAsLink from "../../Button/ButtonAsLink";

export type UpcomingWebinarWallProps = {
  headingTag?: HeadingTag;
  headingText: string;
  text: string;
  buttonOnClick: () => void;
  buttonHref: string;
  buttonText: string;
  buttonSuffixA11y?: string;
};

/**
 * Visual component to cover a webinar if a user is yet to click to 'Register'
 * interest on a past or future webinar.
 *
 * ## Usage
 *
 * Place in a relatively positioned container which has implicit width and
 * height.
 *
 */
const UpcomingWebinarWall: FC<UpcomingWebinarWallProps> = (props) => {
  const {
    headingTag = "h2",
    headingText,
    text,
    buttonText,
    buttonHref,
    buttonOnClick,
    buttonSuffixA11y,
  } = props;
  return (
    <Flex
      $font={["body-3", "body-2"]}
      $textAlign="center"
      $flexDirection="column"
      $justifyContent="center"
      $alignItems="center"
      $background="white"
      $overflow="hidden"
      $cover
    >
      <Box $maxWidth={240} $zIndex="inFront">
        <Heading tag={headingTag} $font={["heading-6", "heading-5"]}>
          {headingText}
        </Heading>
        <P $mt={8}>{text}</P>
        <ButtonAsLink
          $mt={28}
          background="teachersHighlight"
          htmlAnchorProps={{ onClick: buttonOnClick, target: "_blank" }}
          href={buttonHref}
          label={buttonText}
          labelSuffixA11y={buttonSuffixA11y}
          icon="ChevronRight"
          iconPosition="trailing"
        />
      </Box>
      <OakImage
        alt=""
        src={"/images/illustrations/webinar-wall-bg.png"}
        $position="absolute"
        $right={0}
        $bottom={0}
        $width={"40%"}
        $height={"auto"}
        width={401}
        height={289}
        $opacity={0.2}
      />
    </Flex>
  );
};

export default UpcomingWebinarWall;
