import { FC } from "react";
import styled from "styled-components";

import typography from "../../styles/utils/typography";
import { Span } from "../Typography";
import ScreenReaderOnly from "../ScreenReaderOnly/ScreenReaderOnly";
import { SpanProps } from "../Typography/Span";

export type ButtonLabelProps = {
  children: React.ReactNode;
  labelSuffixA11y?: string;
} & SpanProps;

const ButtonLabelWithScreenReaderTitle: FC<ButtonLabelProps> = (props) => {
  const { children, labelSuffixA11y, ...rest } = props;
  return (
    <Span {...rest}>
      {children}
      {labelSuffixA11y && (
        <ScreenReaderOnly>{labelSuffixA11y}</ScreenReaderOnly>
      )}
    </Span>
  );
};

export const StyledButtonLabelWithScreenReaderTitle = styled(
  ButtonLabelWithScreenReaderTitle,
)`
  display: inline-block;
  vertical-align: text-top;
  max-width: 100%;
  ${typography}
`;

StyledButtonLabelWithScreenReaderTitle.defaultProps = {
  $font: "heading-7",
};
export default StyledButtonLabelWithScreenReaderTitle;
