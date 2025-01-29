import { FC } from "react";
import styled, { useTheme } from "styled-components";

import {
  OakColorName,
  OakTheme,
  PropsWithTheme,
  PixelSpacing,
} from "@/styles/theme";
import getColorByLocation from "@/styles/themeHelpers/getColorByLocation";
import getFontFamily from "@/styles/themeHelpers/getFontFamily";
import Icon, { IconName } from "@/components/SharedComponents/Icon.deprecated";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export type BadgeConfig = {
  size: string;
  circleSize: string;
  fontSize: string;
  // px currently in fitting with Icon api
  iconSize: PixelSpacing;
  starColor: OakColorName;
  circleColor: OakColorName;
  textColor: OakColorName;
};

const badgeConfig = (theme: OakTheme) => theme.badge;
const badgeStarColor = ({ theme }: PropsWithTheme) =>
  badgeConfig(theme).starColor;
const badgeCircleColor = ({ theme }: PropsWithTheme) =>
  badgeConfig(theme).circleColor;
const badgeTextColor = ({ theme }: PropsWithTheme) =>
  badgeConfig(theme).textColor;
const badgeSize = ({ theme }: PropsWithTheme) => badgeConfig(theme).size;
const badgeIconSize = ({ theme }: PropsWithTheme) =>
  badgeConfig(theme).iconSize;
const badgeFontSize = ({ theme }: PropsWithTheme) =>
  badgeConfig(theme).fontSize;
const badgeCircleSize = ({ theme }: PropsWithTheme) =>
  badgeConfig(theme).circleSize;

const StarSvg: FC = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 54 54"
    fill="none"
    width="100%"
    height="100%"
    {...props}
  >
    <path
      d="M24.302.967a8 8 0 0 1 5.396 0l1.615.578a8 8 0 0 0 2.1.447l1.71.128a8 8 0 0 1 4.93 2.195l1.24 1.185c.52.497 1.105.921 1.737 1.262l1.511.813a8 8 0 0 1 3.611 4.01l.65 1.588c.273.665.634 1.29 1.074 1.859l1.05 1.357a8 8 0 0 1 1.667 5.132l-.051 1.715a8 8 0 0 0 .224 2.135l.407 1.667a8 8 0 0 1-.564 5.366l-.745 1.546a8.002 8.002 0 0 0-.663 2.042l-.306 1.688a8 8 0 0 1-2.698 4.673l-1.31 1.11a7.999 7.999 0 0 0-1.435 1.595l-.967 1.418a8 8 0 0 1-4.366 3.171l-1.647.482c-.69.201-1.35.495-1.96.873l-1.46.902a8 8 0 0 1-5.279 1.121l-1.7-.23a8.003 8.003 0 0 0-2.146 0l-1.7.23a8 8 0 0 1-5.279-1.121l-1.46-.902a8.004 8.004 0 0 0-1.96-.873l-1.647-.482a8 8 0 0 1-4.366-3.171l-.966-1.418a8.001 8.001 0 0 0-1.437-1.595l-1.309-1.11a8 8 0 0 1-2.698-4.673L2.8 35.992a8.001 8.001 0 0 0-.663-2.042l-.745-1.546a8 8 0 0 1-.564-5.366l.407-1.667a8 8 0 0 0 .224-2.135l-.051-1.715a8 8 0 0 1 1.667-5.132l1.05-1.357a8 8 0 0 0 1.073-1.86l.651-1.587a8 8 0 0 1 3.61-4.01l1.512-.813A8.001 8.001 0 0 0 12.706 5.5l1.24-1.185a8 8 0 0 1 4.93-2.195l1.711-.128a8 8 0 0 0 2.1-.447l1.615-.578Z"
      fill="currentColor"
    />
  </svg>
);

const Star = styled(StarSvg)`
  position: absolute;
  top: 0;
  left: 0;
  color: ${getColorByLocation(badgeStarColor)};
`;
const Circle = styled(Flex)`
  position: relative;
  width: ${badgeCircleSize};
  height: ${badgeCircleSize};
  border-radius: 50%;
  background: ${getColorByLocation(badgeCircleColor)};
  color: ${getColorByLocation(badgeTextColor)};
  font-family: ${getFontFamily("ui")};
  font-weight: 600;
  font-size: ${badgeFontSize};
`;
const Root = styled(Flex)`
  position: relative;
  width: ${badgeSize};
  height: ${badgeSize};
`;

export type CurriculumTabBadgeProps = {
  icon?: IconName;
  text?: string;
};
const CurriculumTabBadge: FC<CurriculumTabBadgeProps> = (props) => {
  const { icon, text, ...rootProps } = props;
  const theme = useTheme();

  return (
    <Root $alignItems="center" $justifyContent="center" {...rootProps}>
      <Star />
      <Circle $alignItems="center" $justifyContent="center">
        {icon ? <Icon name={icon} size={badgeIconSize({ theme })} /> : text}
      </Circle>
    </Root>
  );
};

export default CurriculumTabBadge;
