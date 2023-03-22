import { FC } from "react";

import Flex from "../../Flex";
import { Heading, HeadingTag } from "../../Typography";
import Box from "../../Box";
import ButtonAsLink from "../../Button/ButtonAsLink";
import Illustration from "../../Illustration";

export type UpcomingWebinarWallProps = {
  headingTag?: HeadingTag;
  headingText: string;
  buttonOnClick: () => void;
  buttonHref: string;
  buttonText: string;
  buttonSuffixA11y: string;
};

/**
 * Visual component that goes where the webinar video would be.
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
    buttonText,
    buttonHref,
    buttonOnClick,
    buttonSuffixA11y,
  } = props;
  return (
    <Flex
      $ph={16}
      $font={["body-3", "body-2"]}
      $textAlign="center"
      $flexDirection="column"
      $justifyContent="center"
      $alignItems="center"
      $background="white"
      $overflow="hidden"
      $cover
    >
      <Box $maxWidth={320} $zIndex="inFront">
        <Heading tag={headingTag} $font={["heading-6", "heading-5"]}>
          {headingText}
        </Heading>
        <ButtonAsLink
          $mt={28}
          background="teachersHighlight"
          htmlAnchorProps={{ onClick: buttonOnClick, target: "_blank" }}
          page={null}
          href={buttonHref}
          label={buttonText}
          labelSuffixA11y={buttonSuffixA11y}
          icon="chevron-right"
          $iconPosition="trailing"
        />
      </Box>
      <Box
        $width={"50%"}
        $position="absolute"
        $right={0}
        $bottom={0}
        $height={"100%"}
      >
        <Illustration
          slug={"magic-carpet"}
          $objectFit="contain"
          $objectPosition={"bottom right"}
          $opacity={0.2}
          cropRect={[0, 0, 401, 289]}
          fill
        />
      </Box>
    </Flex>
  );
};

export default UpcomingWebinarWall;
