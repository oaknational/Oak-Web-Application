import { FC, MouseEventHandler } from "react";
import styled, { useTheme } from "styled-components";

import Flex from "../Flex";
import Icon from "../Icon";
import Badge, { BadgeProps } from "../Badge";
import { Body } from "../Typography";
import ellipsis from "../../styles/ellipsis";
import UnstyledButton from "../UnstyledButton";
import { OakColorName } from "../../styles/theme";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";

export type LessonControlConfig = {
  default: {
    background: OakColorName;
    border: string;
    borderColor: OakColorName;
  };
  current: {
    background: OakColorName;
    border: string;
    borderColor: OakColorName;
  };
  complete: {
    background: OakColorName;
    border: string;
    borderColor: OakColorName;
  };
};

type LessonControlStatus = "default" | "current" | "complete";
export type LessonControlProps = {
  status?: LessonControlStatus;
  label: string;
  badgeProps?: BadgeProps;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Root = styled(UnstyledButton)`
  width: 100%;
`;

const Wrapper = styled(Flex)<{ status: LessonControlStatus }>`
  height: 64px;
  border: ${({ status, theme }) => theme.lessonControl[status].border};
  border-color: ${({ status }) =>
    getColorByLocation(({ theme }) => theme.lessonControl[status].borderColor)};
`;

const BadgeWrapper = styled.div``;
const Label = styled(Body)`
  ${ellipsis}
`;
const TextWrapper = styled(Flex)`
  /* min-width: 0; for ellipsis */
  min-width: 0;
`;
const LessonControl: FC<LessonControlProps> = (props) => {
  const { status = "default", label, badgeProps, ...rootProps } = props;
  const theme = useTheme();

  return (
    <Root {...rootProps} title={label}>
      <Wrapper
        pa={4}
        alignItems="center"
        background={theme.lessonControl[status].background}
        status={status}
      >
        {badgeProps && (
          <BadgeWrapper>
            <Badge {...badgeProps} />
          </BadgeWrapper>
        )}
        <TextWrapper alignItems="center" justifyContent="center" flexGrow={1}>
          {status === "current" && <Icon name="ArrowRight" size={20} ml={8} />}
          <Label mh={8}>{label}</Label>
          {status === "complete" && <Icon name="Tick" size={20} mr={8} />}
        </TextWrapper>
      </Wrapper>
    </Root>
  );
};

export default LessonControl;
