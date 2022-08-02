import { FC } from "react";
import styled from "styled-components";

import Flex, { FlexProps } from "../Flex";
import Icon, { IconName } from "../Icon";
import Circle from "../Circle";
import { OakColorName } from "../../styles/theme";
import Typography from "../Typography";
import zIndex from "../../styles/constants/zIndex";
import CardLink from "../Card/CardLink";
import { headingDefaults } from "../Typography/Heading";

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
/**
 * Hack because overlapping circles needed to be position: absolute;
 * meaning the link focus target was sub-optimal without this fix.
 */
const AnchorLink = styled(CardLink)`
  ::after {
    top: -96px;
  }
`;
const LinkText: FC = (props) => (
  <Typography
    {...headingDefaults}
    $position="absolute"
    $top={"100%"}
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

type LessonProgressionGraphicProps = {
  linkTargetIds: {
    introQuiz: string;
    video: string;
    worksheet: string;
    exitQuiz: string;
  };
};
/**
 * LessonElementLinks is a collection graphics linking to sections depending
 * on ids passed in the 'linkTargetIds' prop.
 */
const LessonElementLinks: FC<LessonProgressionGraphicProps> = (props) => {
  const { linkTargetIds } = props;
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
          <LinkText>
            <AnchorLink href={`#${linkTargetIds.introQuiz}`}>
              Intro Quiz
            </AnchorLink>
          </LinkText>
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
          <LinkText>
            <AnchorLink href={`#${linkTargetIds.video}`}>
              Lesson Slides or Video
            </AnchorLink>
          </LinkText>
        </GraphicContainer>
      </Flex>
      <Flex
        $width={["100%", "auto"]}
        $justifyContent={["space-between", "initial"]}
      >
        <GraphicContainer>
          <GraphicCircle icon="LessonSlides" />
          <LinkText>
            <AnchorLink href={`#${linkTargetIds.worksheet}`}>
              Worksheet
            </AnchorLink>
          </LinkText>
        </GraphicContainer>

        <GraphicContainer $mr={0}>
          <GraphicCircle icon="LessonSlides" />
          <LinkText>
            <AnchorLink href={`#${linkTargetIds.exitQuiz}`}>
              Exit Quiz
            </AnchorLink>
          </LinkText>
        </GraphicContainer>
      </Flex>
    </Flex>
  );
};

export default LessonElementLinks;
