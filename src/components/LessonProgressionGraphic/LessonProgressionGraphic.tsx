import { FC } from "react";
import styled from "styled-components";
import Link from "next/link";

import Flex from "../Flex";
import Icon from "../Icon";

const CircleIconContainer = styled(Flex)`
  border-radius: 100px;
  width: 72px;
  height: 72px;
  z-index: 2;
`;

const CircleIconContainerOverlap = styled(Flex)`
  position: absolute;
  border-radius: 100px;
  left: 55px;
  width: 72px;
  height: 72px;
`;

const LessonProgressionGraphic: FC = () => {
  return (
    <Flex $justifyContent={"center"} $flexDirection={["column", "row"]}>
      <Flex>
        <Link href={"/"}>
          <CircleIconContainer
            $background={"grey3"}
            $alignItems={"center"}
            $justifyContent={"center"}
          >
            <Icon size={48} name={"Quiz"}></Icon>
          </CircleIconContainer>
        </Link>

        <Flex $position="relative">
          <Link href={"/"}>
            <CircleIconContainerOverlap
              $background={"grey3"}
              $alignItems={"center"}
              $justifyContent={"center"}
            >
              <Icon size={48} name={"LessonSlides"}></Icon>
            </CircleIconContainerOverlap>
          </Link>
          <CircleIconContainer
            $background={"grey3"}
            $alignItems={"center"}
            $justifyContent={"center"}
          >
            <Link href={"/"}>
              <Icon size={48} name={"Quiz"} />
            </Link>
          </CircleIconContainer>
        </Flex>
      </Flex>

      <Flex $position="relative">
        <CircleIconContainer
          $background={"grey2"}
          $alignItems={"center"}
          $justifyContent={"center"}
        >
          <Icon size={48} name={"Quiz"}></Icon>
        </CircleIconContainer>

        <CircleIconContainer
          $background={"grey2"}
          $alignItems={"center"}
          $justifyContent={"center"}
        >
          <Icon size={48} name={"Quiz"}></Icon>
        </CircleIconContainer>
      </Flex>
    </Flex>
  );
};

export default LessonProgressionGraphic;
