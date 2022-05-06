import { FC } from "react";
import clsx from "clsx";

import Text, { VariantsType } from "../Typography/Typography";
import Icon, { IconName, IconProps } from "../Icon/Icon";

import styles from "./CardText.module.css";

export type CardIconPosition = "aboveTitle" | "before";

export type CardTitleProps = {
  children: string;
  variant?: VariantsType;
  alignCenter?: boolean;
  icon?: IconName;
  iconPosition?: CardIconPosition;
  iconProps?: IconProps;
};

const CardText: FC<CardTitleProps> = ({
  variant = "h5",
  alignCenter = false,
  children,
  icon,
  iconPosition = "before",
  iconProps,
}) => {
  return (
    <div
      className={clsx(styles.cardText, {
        [`${styles["alignCenter"]}`]: alignCenter,
      })}
    >
      {icon && iconPosition === "aboveTitle" && (
        <div className={styles.aboveIconWrap}>
          <Icon
            size={90}
            color="color-icon-bookmarked"
            name={icon}
            {...iconProps}
          />
        </div>
      )}
      <div
        className={clsx({
          [`${styles["textIconWrapper"]}`]: iconPosition === "before",
        })}
      >
        {icon && iconPosition === "before" && (
          <span className={styles.iconWrapper}>
            <Icon name={icon} />
          </span>
        )}
        <Text semanticVariant={variant}>{children}</Text>
      </div>
    </div>
  );
};

export default CardText;
