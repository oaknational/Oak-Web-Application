import { FC } from "react";

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
};
const Icon: FC<IconProps> = (props) => {
  const { name, size = 24, width, height } = props;
  const IconComponent = icons[name];

  const innerWidth = width || size;
  const innerHeight = height || size;

  const outerHeight = props.outerHeight || innerHeight;
  const outerWidth = props.outerWidth || innerWidth;

  return (
    <span
      className={styles["outer-wrapper"]}
      style={{ height: `${outerHeight}px`, width: `${outerWidth}px` }}
    >
      <span
        className={styles["inner-wrapper"]}
        style={{ height: `${innerHeight}px`, width: `${innerWidth}px` }}
      >
        <IconComponent />
      </span>
    </span>
  );
};

export default Icon;
