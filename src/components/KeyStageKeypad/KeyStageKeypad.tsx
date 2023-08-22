import { FC } from "react";

import { TeachersHomePageData } from "../../node-lib/curriculum-api";
import OakLink from "../OakLink";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import { Heading, UL, LI, P } from "../Typography";
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
      <P $font={"heading-7"}>{shortCode}</P>
      <BrushBorders color={backgroundColour} />
    </OakLink>
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
      <P $color={"black"} $mb={16} $font={"heading-7"}>
        Select key stage
      </P>
      <UL $reset $display={"flex"} $mb={years ? 48 : 24} $ph={8} $gap={24}>
        {keyStages.map((keyStage) => (
          <LI $width={[64, 96]} key={`key-stage:${keyStage.title}`}>
            <KeypadLink {...keyStage} />
          </LI>
        ))}
      </UL>

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
          <UL $reset $display={"flex"} $mb={years ? 48 : 24} $ph={8}>
            {years.map((years) => (
              <LI $width={"100%"} key={`year:${years.title}`} $mr={24}>
                <KeypadLink key={`year:${years.title}`} {...years} />
              </LI>
            ))}
          </UL>
        </>
      )}
    </nav>
  );
};

export default KeyStageKeypad;
