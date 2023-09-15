import { FC } from "react";

import useAnalytics from "../../context/Analytics/useAnalytics";
import type { KeyStageTitleValueType } from "../../browser-lib/avo/Avo";
import Flex from "../Flex";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import { Heading, Span } from "../Typography";
import OakLink from "../OakLink";
import Card from "../Card";
import useClickableCard from "../../hooks/useClickableCard";
import Box from "../Box";
import useAnalyticsPageProps from "../../hooks/useAnalyticsPageProps";
import { ProgrammeListingPageData } from "../../node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import Icon from "../Icon/Icon";

const ProgrammeListItem: FC<
  Pick<
    ProgrammeListingPageData,
    "subjectSlug" | "keyStageSlug" | "keyStageTitle"
  > &
    ProgrammeListingPageData["programmes"][number]
> = (props) => {
  const {
    subjectSlug,
    subjectTitle,
    tierTitle,
    examBoardTitle,
    keyStageSlug,
    keyStageTitle,
    lessonCount,
    unitCount,
    programmeSlug,
  } = props;
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  return (
    <Card
      $overflow={"hidden"}
      {...containerProps}
      $pa={0}
      data-testid={"programme-list-item"}
      $background={"white"}
    >
      <Flex
        $transform={isHovered ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
        $ph={16}
      >
        <OakLink
          {...primaryTargetProps}
          page={"unit-index"}
          programmeSlug={programmeSlug}
          onClick={() => {
            tierTitle !== null &&
              track.tierSelected({
                subjectTitle,
                subjectSlug,
                keyStageTitle: keyStageTitle as KeyStageTitleValueType,
                keyStageSlug,
                tierName: tierTitle,
                analyticsUseCase,
              });
          }}
        >
          <Heading
            $mt={8}
            $mb={2}
            $font={"heading-7"}
            tag="h3"
            ariaLabel={`${tierTitle ? tierTitle : ""} ${
              examBoardTitle ? examBoardTitle : ""
            }`}
          >
            {tierTitle ?? examBoardTitle}
          </Heading>
        </OakLink>
      </Flex>
      <Box
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $transition={"all 0.4s ease-out"}
        $transform={isHovered ? "translateY(-8px)" : null}
        $ph={16}
      >
        <Flex
          $mt={2}
          $mb={8}
          $flexDirection={"row"}
          $font={"body-3"}
          $color={"oakGrey4"}
        >
          <Span $mb={4}>{`${unitCount} units`}</Span>
          <Span $mh={4}>
            <Icon name="dot" size={8} />
          </Span>
          <Span $font={"body-3"}>{`${lessonCount} lessons`}</Span>
        </Flex>
      </Box>
      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default ProgrammeListItem;
