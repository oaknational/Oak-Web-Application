import styled from "styled-components";

import { OakColorName } from "../../../styles/theme";
import getColorByName from "../../../styles/themeHelpers/getColorByName";
import { outlineShadow } from "../../SharedComponents/OutlineHeading/OutlineHeading";

import { OL } from "@/components/SharedComponents/Typography";

export const OLOutline = styled(OL)<{ $color: OakColorName }>`
  & div:last-child {
    margin-bottom: 0;
  }

  li {
    margin-left: 32px;
    margin-bottom: 0;
    text-indent: 0;
  }

  & li::before {
    position: absolute;
    top: 12px;
    left: 0;
    font-weight: 600;
    padding-right: 4px;
    padding-left: 32px;
    text-indent: -32px;
    content: counter(item);
    font-size: 50px;
    color: ${(props) => getColorByName(props.$color)};
    text-shadow: ${outlineShadow};
  }

  a {
    color: ${(props) => props.theme.colors.navy};
  }
`;
