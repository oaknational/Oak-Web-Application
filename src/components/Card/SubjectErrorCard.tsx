import { FC } from "react";

import Flex from "../Flex";
import { Heading, HeadingTag, Span } from "../Typography";
import ButtonAsLink, { ButtonAsLinkProps } from "../Button/ButtonAsLink";
import { SpacingProps } from "../../styles/utils/spacing";

type SubjectErrorCardProps = {
  heading: string;
  headingTag: HeadingTag;
  text: string;
  buttonProps: ButtonAsLinkProps;
};

/**
 * Contains an heading, text and button
 *
 * ## Usage
 * Used on unit listing page
 */
const SubjectErrorCard: FC<SubjectErrorCardProps & SpacingProps> = (props) => {
  const { heading, headingTag, text, buttonProps } = props;
  return (
    <Flex
      $ph={16}
      $pv={12}
      $background={"pupilsLimeGreen"}
      $alignItems={["flex-start", "center"]}
      $borderRadius={3}
      $flexDirection={["column", "row"]}
      $width={["100%", "auto"]}
    >
      <Heading $mr={12} $mb={[8, 0]} $font={"heading-7"} tag={headingTag}>
        {heading}
      </Heading>
      <Span $mr={12} $mb={[20, 0]} $font={"body-3"}>
        {text}
      </Span>

      <ButtonAsLink
        $ph={0}
        {...buttonProps}
        variant={"minimal"}
        icon={"arrow-right"}
        $iconPosition={"trailing"}
        iconBackground="black"
      />
    </Flex>
  );
};

export default SubjectErrorCard;
