import { FC } from "react";

import { TeachersHomePageData } from "../../node-lib/curriculum-api";
import Grid, { GridArea } from "../Grid";
import OakLink from "../OakLink";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import { Heading } from "../Typography";
import useAnalytics from "../../context/Analytics/useAnalytics";
import useUseCase from "../../hooks/useUseCase";
import type { KeyStageNameValueType } from "../../browser-lib/avo/Avo";

export type KeypadItem = TeachersHomePageData["keyStages"][number];

export type KeyStageKeypadProps = {
  keyStages: KeypadItem[];
  years?: KeypadItem[];
};

const KeypadLink: FC<KeypadItem> = (props) => {
  const { shortCode, slug, title } = props;
  const { track } = useAnalytics();
  const useCase = useUseCase();

  return (
    <GridArea $colSpan={[3]}>
      <OakLink
        $background={"white"}
        $position={"relative"}
        $justifyContent={"center"}
        $alignItems={"center"}
        $height={28}
        $display={"flex"}
        slug={slug}
        page={"subject-index"}
        onClick={() => {
          track.keyStageSelected({
            keyStageName: title as KeyStageNameValueType,
            keyStageSlug: slug,
            navigatedFrom: "card",
            useCase,
          });
        }}
      >
        <BrushBorders color={"white"} />
        <Heading $font={"heading-7"} tag={"h4"}>
          {shortCode}
        </Heading>
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
      <Heading $color={"oakGrey5"} $mb={20} tag="h3" $font={"heading-light-7"}>
        Key stage
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
