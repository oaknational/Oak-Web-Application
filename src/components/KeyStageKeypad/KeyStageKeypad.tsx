import { FC } from "react";

import { TeachersHomePageData } from "../../node-lib/curriculum-api";
import Grid, { GridArea } from "../Grid";
import OakLink from "../OakLink";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import { Heading } from "../Typography";
import useAnalytics from "../../context/Analytics/useAnalytics";
import type { KeyStageTitleValueType } from "../../browser-lib/avo/Avo";
import useAnalyticsPageProps from "../../hooks/useAnalyticsPageProps";
import useIsCurrent from "../MenuLinks/useIsCurrent";

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
    <GridArea $colSpan={[3]}>
      <OakLink
        $background={backgroundColour}
        $position={"relative"}
        $justifyContent={"center"}
        $alignItems={"center"}
        $height={28}
        $display={"flex"}
        keyStageSlug={slug}
        page={"subject-index"}
        viewType="teachers"
        $isSelected={isCurrent}
        onClick={() => {
          track.keyStageSelected({
            keyStageTitle: title as KeyStageTitleValueType,
            keyStageSlug: slug,
            navigatedFrom: "card",
            analyticsUseCase,
          });
        }}
      >
        <Heading $font={"heading-7"} tag={"h4"}>
          {shortCode}
        </Heading>
        <BrushBorders color={backgroundColour} />
      </OakLink>
    </GridArea>
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
      <Heading $color={"black"} $mb={16} tag="h3" $font={"heading-7"}>
        Select key stage
      </Heading>
      <Grid $mb={years ? 48 : 24} $cg={24} $ph={8}>
        {keyStages.map((keyStage) => (
          <KeypadLink key={`key-stage:${keyStage.title}`} {...keyStage} />
        ))}
      </Grid>
      {years && (
        <>
          <Heading
            $color={"oakGrey4"}
            $mb={20}
            tag="h3"
            $font={"heading-light-7"}
          >
            Year
          </Heading>
          <Grid $rg={24} $mb={24} $cg={24} $ph={8}>
            {years.map((years) => (
              <KeypadLink key={`year:${years.title}`} {...years} />
            ))}
          </Grid>
        </>
      )}
    </nav>
  );
};

export default KeyStageKeypad;
