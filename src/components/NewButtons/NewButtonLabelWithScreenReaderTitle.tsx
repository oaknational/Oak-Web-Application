import { FC } from "react";
import styled from "styled-components";

import typography from "../../styles/utils/typography";
import { SpanProps } from "../SharedComponents/Typography/Span";

import { Span } from "@/components/SharedComponents/Typography";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";

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
