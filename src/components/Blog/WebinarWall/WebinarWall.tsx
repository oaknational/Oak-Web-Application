import { FC } from "react";

import Flex from "../../Flex";
import Button from "../../Button";
import { Heading, HeadingTag, P } from "../../Typography";
import Box from "../../Box";

type WebinarWallProps = {
  onClick: () => void;
  headingTag: HeadingTag;
};

/**
 * Visual component to cover a webinar if a user is yet to click "Register".
 *
 * ## Usage
 *
 * Place in a relatively positioned container which has implicit width and
 * height.
 *
 */
const WebinarWall: FC<WebinarWallProps> = (props) => {
  const { onClick, headingTag } = props;
  return (
    <Flex
      $font={["body-3", "body-2"]}
      $textAlign="center"
      $flexDirection="column"
      $justifyContent="center"
      $alignItems="center"
      $cover
    >
      <Box $maxWidth={240}>
        <Heading tag={headingTag} $font={["heading-6", "heading-5"]}>
          Register to view
        </Heading>
        <P $mt={8}>
          You will only need to register once and you’ll be good to go.
        </P>
        <Button
          $mt={28}
          background="teachersHighlight"
          onClick={onClick}
          label="Register"
          labelSuffixA11y="for webinars"
          fullWidth
        />
      </Box>
    </Flex>
  );
};

export default WebinarWall;
