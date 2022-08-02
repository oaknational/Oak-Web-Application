import { FC } from "react";
import styled from "styled-components";

import Flex, { FlexProps } from "../Flex";
import Icon, { IconName } from "../Icon";
import Circle from "../Circle";
import { OakColorName } from "../../styles/theme";
import { Heading } from "../Typography";
import zIndex from "../../styles/constants/zIndex";

const GraphicContainer: FC<FlexProps> = (props) => (
  <Flex $flexDirection="column" $mr={40} $position="relative" {...props} />
);
type GraphicCircleProps = {
  icon: IconName;
  $background?: OakColorName;
};

const OverlapBehind = styled.div`
  transform: translateX(-16px);
`;
const OverlapInFront = styled.div`
  z-index: ${zIndex.inFront};
`;
const Text: FC = (props) => (
  <Heading
    $position="absolute"
    $top="100%"
    tag="h3"
    $fontSize={16}
    $textAlign="center"
    $mt={16}
    {...props}
  />
);
const GraphicCircle: FC<GraphicCircleProps> = ({
  icon,
  $background = "teachersPastelYellow",
}) => (
  <Circle size={72} $background={$background} $dropShadow="grey20">
    <Icon size={48} name={icon}></Icon>
  </Circle>
);

/**
 * LessonProgressionGraphic is a graphical summary of the different resources
 * used in planning a lesson the Oak way.
 */
const LessonProgressionGraphic: FC = () => {
  return (
    <Flex
      $justifyContent={"center"}
      $flexDirection={["column", "row"]}
      $mb={80}
    >
      <Flex
        $mb={[80, 0]}
        $width={["100%", "auto"]}
        $justifyContent={["space-between", "initial"]}
      >
        <GraphicContainer>
          <GraphicCircle icon="Quiz" />
          <Text>Intro Quiz</Text>
        </GraphicContainer>

        <GraphicContainer $mr={[0, 40]}>
          <Flex $mr={-16}>
            <OverlapInFront>
              <GraphicCircle icon="LessonSlides" $background="pastelTurqoise" />
            </OverlapInFront>
            <OverlapBehind>
              <GraphicCircle icon="Quiz" />
            </OverlapBehind>
          </Flex>
          <Text>Lesson Slides or Video</Text>
        </GraphicContainer>
      </Flex>
      <Flex
        $width={["100%", "auto"]}
        $justifyContent={["space-between", "initial"]}
      >
        <GraphicContainer>
          <GraphicCircle icon="LessonSlides" />
          <Text>Worksheet</Text>
        </GraphicContainer>

        <GraphicContainer $mr={0}>
          <GraphicCircle icon="LessonSlides" />
          <Text>Exit Quiz</Text>
        </GraphicContainer>
      </Flex>
    </Flex>
  );
};

export default LessonProgressionGraphic;
