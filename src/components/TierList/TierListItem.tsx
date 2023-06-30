import { FC } from "react";

import useAnalytics from "../../context/Analytics/useAnalytics";
import type { KeyStageTitleValueType } from "../../browser-lib/avo/Avo";
import Flex from "../Flex";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import { Heading, Span } from "../Typography";
import { OakColorName } from "../../styles/theme/types";
import OakLink from "../OakLink";
import Card from "../Card";
import useClickableCard from "../../hooks/useClickableCard";
import Box from "../Box";
import useAnalyticsPageProps from "../../hooks/useAnalyticsPageProps";
import { ProgrammeListingPageData } from "../../node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

type BackgroundProps = {
  background: OakColorName;
};

const TierListItem: FC<
  Pick<
    ProgrammeListingPageData,
    "subjectSlug" | "keyStageSlug" | "keyStageTitle"
  > &
    ProgrammeListingPageData["programmes"][number] &
    BackgroundProps
> = (props) => {
  const {
    subjectSlug,
    subjectTitle,
    tierTitle,
    keyStageSlug,
    keyStageTitle = "",
    background,
    lessonCount,
    unitCount,
    programmeSlug,
  } = props;
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  if (!tierTitle) {
    return null;
  }

  return (
    <Card
      $overflow={"hidden"}
      {...containerProps}
      $pa={0}
      data-testid={"tier-list-item"}
    >
      <Flex
        $transform={isHovered ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
        $background={background}
      >
        <OakLink
          {...primaryTargetProps}
          page={"unit-index"}
          viewType="teachers"
          programmeSlug={programmeSlug}
          onClick={() => {
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
          <Heading $ma={16} $font={"heading-7"} tag="h3">
            {tierTitle}
          </Heading>
        </OakLink>
      </Flex>
      <Box
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $transition={"all 0.4s ease-out"}
        $transform={isHovered ? "translateY(-8px)" : null}
      >
        <Flex
          $ma={16}
          $flexDirection={"column"}
          $font={"body-3"}
          $color={"oakGrey4"}
        >
          <Span $mb={4}>{`${unitCount} units`}</Span>
          <Span $font={"body-3"}>{`${lessonCount} lessons`}</Span>
        </Flex>
      </Box>
      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default TierListItem;
