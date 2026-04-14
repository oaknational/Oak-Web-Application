import {
  OakBoxProps,
  oakBoxCss,
  OakUiRoleToken,
} from "@oaknational/oak-components";
import { FC } from "react";
import styled from "styled-components";

import getSvgId, {
  SvgName,
} from "@/components/SharedComponents/SpriteSheet/getSvgId";
const StyledSvg = styled.svg<OakBoxProps>`
  ${oakBoxCss}
`;
export type SvgProps = OakBoxProps & {
  name: SvgName;
  className?: string;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
  color?: OakUiRoleToken;
  filter?: string;
};
const Svg: FC<SvgProps> = (props) => {
  const { color, $color = color, ...rest } = props;

  return (
    <StyledSvg
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      $transition={"standard-ease"}
      $color={$color}
      {...rest}
    >
      <use xlinkHref={`/images/sprite/sprite.svg#${getSvgId(rest)}`} />
    </StyledSvg>
  );
};

export default Svg;
