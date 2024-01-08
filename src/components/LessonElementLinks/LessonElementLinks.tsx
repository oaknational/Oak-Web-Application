import { FC } from "react";
import styled from "styled-components";

import { zIndexMap } from "../../styles/utils/zIndex";
import GraphiCircleIcon from "../SharedComponents/Icon/GraphicCircleIcon";

import { GridList } from "@/components/SharedComponents/Typography/UL";
import { IconName } from "@/components/SharedComponents/Icon";
import Typography, { LI } from "@/components/SharedComponents/Typography";
import CardLink from "@/components/SharedComponents/Card/CardLink";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex";

const GraphicContainer: FC<FlexProps> = (props) => (
  <Flex
    $flexDirection="column"
    $alignItems="center"
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

type ElementListItem = {
  id: string;
  label: string;
  icon: IconName | [IconName, IconName];
  href: string;
};

const ElementIcon = (props: { icon: IconName | [IconName, IconName] }) => {
  if (Array.isArray(props.icon)) {
    return (
      <Flex $mr={-16}>
        <GraphiCircleIcon
          $zIndex="inFront"
          icon={props.icon[0]}
          $background="aqua"
        />
        <OverlapBehind>
          <GraphiCircleIcon icon={props.icon[1]} />
        </OverlapBehind>
      </Flex>
    );
  } else {
    return <GraphiCircleIcon icon={props.icon} />;
  }
};

/**
 * LessonElementLinks is a collection graphics linking to sections depending
 * on ids passed in the 'linkTargetIds' prop.
 */
const LessonElementLinks: FC<LessonProgressionGraphicProps> = (props) => {
  const { linkTargetIds } = props;
  const elementList: Array<ElementListItem> = [
    {
      id: "introQuiz",
      label: "Starter quiz",
      icon: "quiz",
      href: `#${linkTargetIds.introQuiz}`,
    },
    {
      id: "video",
      label: "Slide deck or video",
      icon: ["slide-deck", "video"],
      href: `#${linkTargetIds.video}`,
    },
    {
      id: "worksheet",
      label: "Worksheet",
      icon: "worksheet",
      href: `#${linkTargetIds.worksheet}`,
    },
    {
      id: "exitQuiz",
      label: "Exit quiz",
      icon: "quiz",
      href: `#${linkTargetIds.exitQuiz}`,
    },
  ];

  return (
    <GridList
      $gridTemplateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]}
      $cg={40}
      $rg={80}
      $mb={80}
      $width="min-content"
    >
      {elementList.map((element) => (
        <LI key={element.id} $pa={0} listStyle="none">
          <GraphicContainer $zIndex="neutral">
            <ElementIcon icon={element.icon} />
            <LinkText>
              <AnchorLink page={null} href={element.href}>
                {element.label}
              </AnchorLink>
            </LinkText>
          </GraphicContainer>
        </LI>
      ))}
    </GridList>
  );
};

export default LessonElementLinks;
