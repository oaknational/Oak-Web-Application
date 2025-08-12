import { FC } from "react";
import styled from "styled-components";
import { OakSpan, OakSpanProps } from "@oaknational/oak-components";

import typography, { TypographyProps } from "@/styles/utils/typography";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";

export type ButtonLabelProps = {
  children: React.ReactNode;
  labelSuffixA11y?: string;
} & OakSpanProps;

const ButtonLabelWithScreenReaderTitle: FC<
  ButtonLabelProps & TypographyProps
> = (props) => {
  const { children, labelSuffixA11y, ...rest } = props;
  return (
    <OakSpan {...rest}>
      {children}
      {labelSuffixA11y && (
        <ScreenReaderOnly>{labelSuffixA11y}</ScreenReaderOnly>
      )}
    </OakSpan>
  );
};

export const HopePageTabButtonLabelWithScreenReaderTitle = styled(
  ButtonLabelWithScreenReaderTitle,
)`
  display: inline-block;
  vertical-align: text-top;
  max-width: 100%;
  ${typography}
`;

HopePageTabButtonLabelWithScreenReaderTitle.defaultProps = {
  $font: "heading-7",
};
export default HopePageTabButtonLabelWithScreenReaderTitle;
