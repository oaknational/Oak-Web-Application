import { FC } from "react";
import {
  OakHeading,
  OakHeadingTag,
  OakSpan,
} from "@oaknational/oak-components";

import ButtonAsLink, {
  ButtonAsLinkProps,
} from "@/components/SharedComponents/Button/ButtonAsLink";
import { SpacingProps } from "@/styles/utils/spacing";
import Flex from "@/components/SharedComponents/Flex";

type SubjectErrorCardProps = {
  heading: string;
  headingTag: OakHeadingTag;
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
      $background={"mint"}
      $alignItems={["flex-start", "center"]}
      $borderRadius={3}
      $flexDirection={["column", "row"]}
      $width={["100%", "auto"]}
    >
      <OakHeading
        $mr={"space-between-xs"}
        $mb={["space-between-ssx", "space-between-none"]}
        $font={"heading-7"}
        tag={headingTag}
      >
        {heading}
      </OakHeading>
      <OakSpan
        $mr={"space-between-xs"}
        $mb={["space-between-m", "space-between-none"]}
        $font={"body-3"}
      >
        {text}
      </OakSpan>

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
