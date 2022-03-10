import { FC } from "react";

import styles from "./index.module.css";
import ChevronRight from "./ChevronRight.icon";
import OpenExternal from "./OpenExternal.icon";
import Download from "./Download.icon";
import Share from "./Share.icon";

const icons = {
  ChevronRight,
  OpenExternal,
  Download,
  Share,
};

export type IconName = keyof typeof icons;

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
