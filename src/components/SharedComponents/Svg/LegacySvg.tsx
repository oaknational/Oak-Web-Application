import { FC } from "react";
import styled from "styled-components";

import getSvgId, {
  SvgName,
} from "@/components/SharedComponents/SpriteSheet/getSvgId";
import { OakColorName } from "@/styles/theme/types";
import { box, BoxProps } from "@/components/SharedComponents/Box";

const StyledSvg = styled.svg<BoxProps>`
  ${box};
  transition: all 0.3s ease;
`;
export type LegacySvgProps = BoxProps & {
  name: SvgName;
  className?: string;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
  color?: OakColorName;
  filter?: string;
};
/**
 * This component should not be used. It uses the old Box component before OakBox
 * this legacy only exists to avoid breaking changes in the short term, but
 * should be removed as soon as SharedComponents/Button and Icon.deprecated has
 * been removed
 * @deprecated use Svg instead
 */
const LegacySvg: FC<LegacySvgProps> = (props) => {
  return (
    <StyledSvg
      aria-hidden={true}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      {...props}
    >
      <use xlinkHref={`/images/sprite/sprite.svg#${getSvgId(props)}`} />
    </StyledSvg>
  );
};

export default LegacySvg;
