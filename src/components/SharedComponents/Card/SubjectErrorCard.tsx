import { FC } from "react";
import {
  OakHeading,
  OakHeadingTag,
  OakSpan,
  OakFlex,
} from "@oaknational/oak-components";

import ButtonAsLink, {
  ButtonAsLinkProps,
} from "@/components/SharedComponents/Button/ButtonAsLink";
import { SpacingProps } from "@/styles/utils/spacing";

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
    <OakFlex
      $ph="inner-padding-m"
      $pv="inner-padding-s"
      $background={"mint"}
      $alignItems={["flex-start", "center"]}
      $borderRadius="border-radius-s"
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
    </OakFlex>
  );
};

export default SubjectErrorCard;
