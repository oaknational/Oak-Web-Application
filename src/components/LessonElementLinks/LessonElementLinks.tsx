import { FC } from "react";
import styled from "styled-components";

import Flex, { FlexProps } from "../Flex";
import Typography from "../Typography";
import CardLink from "../Card/CardLink";
import { zIndexMap } from "../../styles/utils/zIndex";
import GraphiCircleIcon from "../Icon/GraphicCircleIcon";

const GraphicContainer: FC<FlexProps> = (props) => (
  <Flex
    $flexDirection="column"
    $alignItems="center"
    $mr={40}
    $position="relative"
    {...props}
  />
);

const OverlapBehind = styled.div`
  transform: translateX(-16px);
  z-index: ${zIndexMap.behind};
`;

/**
 * ::after hack because overlapping circles needed to be position: absolute;
 * meaning the link focus target was sub-optimal without this fix.
 *
 * width+translateX hack to allow for text wider than the circles.
 */
const AnchorLink = styled(CardLink)`
  width: calc(100% + 20px);
  display: block;
  transform: translateX(-10px);

  ::after {
    top: -96px;
  }
`;
const LinkText: FC<{ children?: React.ReactNode }> = (props) => (
  <Typography
    $position="absolute"
    $top={"100%"}
    $font={"heading-7"}
    $textAlign="center"
    $mt={16}
    {...props}
  />
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
          <GraphiCircleIcon icon="quiz" />
          <LinkText>
            <AnchorLink page={null} href={`#${linkTargetIds.introQuiz}`}>
              Intro quiz
            </AnchorLink>
          </LinkText>
        </GraphicContainer>
        <GraphicContainer $zIndex="neutral" $mr={[0, 40]}>
          <Flex $mr={-16}>
            <GraphiCircleIcon
              $zIndex="neutral"
              icon="slide-deck"
              $background="pastelTurquoise"
            />
            <OverlapBehind>
              <GraphiCircleIcon icon="video" />
            </OverlapBehind>
          </Flex>
          <LinkText>
            <AnchorLink page={null} href={`#${linkTargetIds.video}`}>
              Lesson slides or video
            </AnchorLink>
          </LinkText>
        </GraphicContainer>
      </Flex>
      <Flex
        $width={["100%", "auto"]}
        $justifyContent={["space-between", "initial"]}
      >
        <GraphicContainer>
          <GraphiCircleIcon icon="worksheet" />
          <LinkText>
            <AnchorLink page={null} href={`#${linkTargetIds.worksheet}`}>
              Worksheet
            </AnchorLink>
          </LinkText>
        </GraphicContainer>

        <GraphicContainer $mr={0}>
          <GraphiCircleIcon icon="quiz" />
          <LinkText>
            <AnchorLink page={null} href={`#${linkTargetIds.exitQuiz}`}>
              Exit quiz
            </AnchorLink>
          </LinkText>
        </GraphicContainer>
      </Flex>
    </Flex>
  );
};

export default LessonElementLinks;
