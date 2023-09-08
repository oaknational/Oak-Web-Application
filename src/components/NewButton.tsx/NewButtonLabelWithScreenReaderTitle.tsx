import { FC } from "react";
import styled from "styled-components";

import ellipsis from "../../styles/ellipsis";
import typography from "../../styles/utils/typography";
import { Span } from "../Typography";
import ScreenReaderOnly from "../ScreenReaderOnly/ScreenReaderOnly";
import { SpanProps } from "../Typography/Span";

export const ButtonLabelSpan = styled(Span)`
  display: inline-block;
  vertical-align: text-top;
  max-width: 100%;
  ${typography}
  ${ellipsis}
`;

ButtonLabelSpan.defaultProps = {
  $font: "heading-7",
};

export type ButtonLabelProps = {
  children: React.ReactNode;
  labelSuffixA11y?: string;
} & SpanProps;

const ButtonLabelWithScreenReaderTitle: FC<ButtonLabelProps> = (props) => {
  const { children, labelSuffixA11y, ...rest } = props;
  return (
    <ButtonLabelSpan {...rest}>
      {children}
      {labelSuffixA11y && (
        <ScreenReaderOnly>{labelSuffixA11y}</ScreenReaderOnly>
      )}
    </ButtonLabelSpan>
  );
};

export default ButtonLabelWithScreenReaderTitle;
