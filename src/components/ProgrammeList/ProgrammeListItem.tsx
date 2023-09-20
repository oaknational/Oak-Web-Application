import { FC } from "react";

import useAnalytics from "@/context/Analytics/useAnalytics";
import type { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import Flex from "@/components/Flex";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders";
import { Heading } from "@/components/Typography";
import OakLink from "@/components/OakLink";
import Card from "@/components/Card";
import useClickableCard from "@/hooks/useClickableCard";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

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
        $pa={16}
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

      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default ProgrammeListItem;
