import { FC } from "react";
import clsx from "clsx";

import { IconColorOverride } from "../../styles/themes/types";

import styles from "./Icon.module.css";
import ChevronRight from "./ChevronRight.icon";
import OpenExternal from "./OpenExternal.icon";
import Download from "./Download.icon";
import Share from "./Share.icon";
import Star from "./Star.icon";

export const ICON_NAMES = [
  "ChevronRight",
  "OpenExternal",
  "Download",
  "Share",
  "Star",
] as const;
export type IconName = typeof ICON_NAMES[number];
export const icons: Record<IconName, FC> = {
  ChevronRight,
  OpenExternal,
  Download,
  Share,
  Star,
};

type IconProps = {
  name: IconName;
  /**
   * size in pixels is the value for width and height if they are not separately provided
   */
  size?: number;
  width?: number;
  height?: number;
  outerWidth?: number;
  outerHeight?: number;
  /**
   * by default, the color will take the css `color` value of its closest ancester
   * (because in the SVG, the color is set to `currentColor`). Use `color` prop to
   * override this value.
   */
  color?: IconColorOverride;
};
const Icon: FC<IconProps> = (props) => {
  const { name, size = 24, width, height, color } = props;
  const IconComponent = icons[name];

  const innerWidth = width || size;
  const innerHeight = height || size;

  const outerHeight = props.outerHeight || innerHeight;
  const outerWidth = props.outerWidth || innerWidth;
  console.log(color);

  return (
    <span
      className={styles.outerWrapper}
      style={{ height: `${outerHeight}px`, width: `${outerWidth}px` }}
    >
      <span
        className={clsx(styles.innerWrapper, color && styles[color])}
        style={{ height: `${innerHeight}px`, width: `${innerWidth}px` }}
      >
        <IconComponent />
      </span>
    </span>
  );
};

export default Icon;
