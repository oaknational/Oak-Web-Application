import { FC } from "react";
import styled from "styled-components";

import Icon, { IconName } from "../../Icon";
import { Heading } from "../../Typography";

export type CardTitleProps = {
  title: string;
  icon?: IconName;
  iconPosition?: "leading" | "trailing" | "aboveTitle";
  textCenter?: boolean;
};

const CardTitleWrap = styled.div<
  Pick<CardTitleProps, "iconPosition" | "textCenter">
>`
  display: flex;
  flex-direction: ${({ iconPosition }) =>
    (iconPosition === "leading" && "row") ||
    (iconPosition === "trailing" && "row-reverse") ||
    (iconPosition === "aboveTitle" && "column")};
  justify-content: ${(props) => (props.textCenter ? "center" : "start")};
  align-items: center;
  padding: 24px;
`;

const IconWrapper = styled.div<Pick<CardTitleProps, "iconPosition">>`
  position: relative;
  top: 3px;
`;

const CardTitle: FC<CardTitleProps> = ({
  title,
  textCenter,
  icon,
  iconPosition,
}) => {
  return (
    <CardTitleWrap iconPosition={iconPosition} textCenter={textCenter}>
      {icon && (
        <IconWrapper iconPosition={iconPosition}>
          <Icon
            name={icon}
            size={iconPosition === "aboveTitle" ? 80 : 35}
            mb={iconPosition === "aboveTitle" ? 24 : 0}
          />
        </IconWrapper>
      )}
      <Heading
        ml={iconPosition === (icon && "leading") ? 8 : 0}
        mr={iconPosition === (icon && "trailing") ? 8 : 0}
        size={5}
        tag={"h4"}
      >
        {title}
      </Heading>
    </CardTitleWrap>
  );
};

export default CardTitle;
