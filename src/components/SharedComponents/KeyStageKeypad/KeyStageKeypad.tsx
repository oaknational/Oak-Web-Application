import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLI,
  OakP,
} from "@oaknational/oak-components";

import { TeachersHomePageData } from "@/node-lib/curriculum-api";
import OwaLink from "@/components/SharedComponents/OwaLink";
import useAnalytics from "@/context/Analytics/useAnalytics";
import type { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import useIsCurrent from "@/components/SharedComponents/useIsCurrent/useIsCurrent";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { UL } from "@/components/SharedComponents/Typography";

export type KeypadItem = TeachersHomePageData["keyStages"][number];

export type KeyStageKeypadProps = {
  keyStages: KeypadItem[];
  years?: KeypadItem[];
};

const KeypadLink: FC<KeypadItem> = (props) => {
  const { shortCode, slug, title } = props;
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const isCurrent = useIsCurrent({ keyStageSlug: slug });
  const backgroundColour = isCurrent ? "black" : "white";

  return (
    <OwaLink
      $background={backgroundColour}
      $position={"relative"}
      $justifyContent={"center"}
      $alignItems={"center"}
      $height={28}
      $display={"flex"}
      keyStageSlug={slug}
      page={"subject-index"}
      $isSelected={isCurrent}
      aria-label={title}
      onClick={() => {
        track.keyStageSelected({
          keyStageTitle: title as KeyStageTitleValueType,
          keyStageSlug: slug,
          navigatedFrom: "card",
          analyticsUseCase,
        });
      }}
    >
      <OakP $font={"heading-7"}>{shortCode}</OakP>
      <BrushBorders color={backgroundColour} />
    </OwaLink>
  );
};

/**
 * Navigation to keystage and years.
 * ## Usage
 * Used on teachers home page and menu.
 */
const KeyStageKeypad: FC<KeyStageKeypadProps> = ({ keyStages, years }) => {
  return (
    <nav aria-label="key stages and year groups">
      <OakP $color={"black"} $mb="space-between-s" $font={"heading-7"}>
        Select key stage
      </OakP>
      <OakGrid
        $mb={years ? "space-between-l" : "space-between-m"}
        $ph={"inner-padding-xs"}
        $cg={"all-spacing-6"}
        $maxWidth={"all-spacing-22"}
      >
        {keyStages.map((keyStage) => (
          <OakGridArea $colSpan={[3]} key={`key-stage:${keyStage.title}`}>
            <KeypadLink {...keyStage} />
          </OakGridArea>
        ))}
      </OakGrid>

      {years && (
        <>
          <OakHeading
            $color={"grey60"}
            $mb={"space-between-m"}
            tag="h3"
            $font={"heading-light-7"}
          >
            Year
          </OakHeading>
          <UL $reset $display={"flex"} $mb={years ? 48 : 24} $ph={8}>
            {years.map((years) => (
              <OakLI
                $width={"100%"}
                key={`year:${years.title}`}
                $mr={"space-between-m"}
              >
                <KeypadLink key={`year:${years.title}`} {...years} />
              </OakLI>
            ))}
          </UL>
        </>
      )}
    </nav>
  );
};

export default KeyStageKeypad;
