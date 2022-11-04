import { FC } from "react";

import Flex from "../../Flex";
import Button from "../../Button";
import { Heading, HeadingTag, P } from "../../Typography";
import Box from "../../Box";

type UpcomingWebinarProps = {
  onClick: () => void;
  headingTag: HeadingTag;
  title: string;
  date: string;
  description: string;
};

/**
 *
 * ## Usage
 *

 *
 */
const UpcomingWebinar: FC<UpcomingWebinarProps> = (props) => {
  const { onClick, headingTag, title, date, description } = props;
  return (
    <Flex
      $position={"relative"}
      $flexDirection={["column", "row"]}
      $alignItems={"center"}
      $pa={0}
      $width={"100%"}
      $font={["body-4", "body-3"]}
    >
      <Box>
        <P>Coming soon, 8th March 2023</P>
        <Heading tag={headingTag} $font={["heading-6", "heading-5"]} $mt={8}>
          Why are teachers still using Oak?
        </Heading>
        <P $mt={8}>
          We know schools are facing yet another challenging term, with
          increasing numbers of staff and pupils isolating due to Covid.
        </P>
      </Box>
      <Button
        $ml={48}
        background="teachersHighlight"
        onClick={onClick}
        label="Notify me"
        labelSuffixA11y={`about `}
        icon="ChevronRight"
        iconPosition="trailing"
      />
    </Flex>
  );
};

export default UpcomingWebinar;
