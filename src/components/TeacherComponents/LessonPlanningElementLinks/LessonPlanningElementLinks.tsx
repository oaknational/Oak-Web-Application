import { FC } from "react";
import styled from "styled-components";
import { OakGrid, OakLI } from "@oaknational/oak-components";

import GraphiCircleIcon from "@/components/SharedComponents/Icon.deprecated/GraphicCircleIcon";
import { zIndexMap } from "@/styles/utils/zIndex";
import { IconName } from "@/components/SharedComponents/Icon.deprecated";
import Typography from "@/components/SharedComponents/Typography";
import CardLink from "@/components/SharedComponents/Card/CardLink";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

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
const LessonPlanningElementLinks: FC<LessonProgressionGraphicProps> = (
  props,
) => {
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
    <OakGrid
      $gridTemplateColumns={["repeat(2, 1fr)", "repeat(4, 1fr)"]}
      $cg={"all-spacing-8"}
      $rg={"space-between-xxxl"}
      $mb={"space-between-xxxl"}
      $width="min-content"
    >
      {elementList.map((element) => (
        <OakLI key={element.id} $pa={"inner-padding-none"} $listStyle="none">
          <GraphicContainer $zIndex="neutral">
            <ElementIcon icon={element.icon} />
            <LinkText>
              <AnchorLink page={null} href={element.href}>
                {element.label}
              </AnchorLink>
            </LinkText>
          </GraphicContainer>
        </OakLI>
      ))}
    </OakGrid>
  );
};

export default LessonPlanningElementLinks;
