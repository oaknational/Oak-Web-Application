import { FC } from "react";
import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLI,
  OakP,
  OakUL,
} from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";
import useIsCurrent from "@/components/SharedComponents/useIsCurrent/useIsCurrent";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { KeyStagesData } from "@/node-lib/curriculum-api-2023";

type KeyStageOnClick = {
  trackingOnClick: (
    filterValue: string,
    activeFilters: Record<string, string[]>,
  ) => void;
};

export type KeypadItem = KeyStagesData["keyStages"][number];

export type KeyStageKeypadProps = {
  title: string;
  titleTag?: "h2" | "h3";
  keyStages: KeypadItem[];
  years?: KeypadItem[];
} & KeyStageOnClick;

const KeypadLink: FC<KeypadItem & KeyStageOnClick> = (props) => {
  const { shortCode, slug, title, trackingOnClick } = props;
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
      aria-current={isCurrent ? "page" : undefined}
      aria-label={title}
      role="button"
      onClick={() => trackingOnClick(slug, {})}
    >
      <OakP $font={"heading-7"}>{shortCode}</OakP>
      <BrushBorders color={backgroundColour} />
    </OwaLink>
  );
};

const KeyPadGrid = (
  props: Omit<KeyStageKeypadProps, "title"> & { ksButtonSpan: 2 | 3 },
) => {
  return (
    <OakGrid
      $mb={props.years ? "space-between-l" : "space-between-m"}
      $ph={"inner-padding-xs"}
      $cg={"all-spacing-6"}
      $rg="all-spacing-6"
      $maxWidth={"all-spacing-22"}
    >
      {props.keyStages.map((keyStage) => (
        <OakGridArea
          $colSpan={[3, props.ksButtonSpan]}
          key={`key-stage:${keyStage.title}`}
        >
          <KeypadLink {...keyStage} trackingOnClick={props.trackingOnClick} />
        </OakGridArea>
      ))}
    </OakGrid>
  );
};

/**
 * Navigation to keystage and years.
 * ## Usage
 * Used on teachers home page and menu.
 */
const KeyStageKeypad: FC<KeyStageKeypadProps> = ({
  title,
  titleTag = "h2",
  keyStages,
  trackingOnClick,
  years,
}) => {
  const ksButtonSpanDesktop = keyStages.length > 4 ? 2 : 3;

  keyStages.sort((a, b) =>
    a.displayOrder && b.displayOrder ? a.displayOrder - b.displayOrder : 0,
  );

  const keyStagesMobileOrder: KeypadItem[] =
    keyStages.length > 4 && keyStages[0]
      ? [...keyStages.slice(1), keyStages[0]]
      : keyStages;

  return (
    <nav aria-label="key stages and year groups">
      <OakHeading
        tag={titleTag}
        $color={"black"}
        $mb="space-between-s"
        $font={"heading-7"}
      >
        {title}
      </OakHeading>
      <OakBox $display={["none", "block"]}>
        <KeyPadGrid
          keyStages={keyStages}
          years={years}
          ksButtonSpan={ksButtonSpanDesktop}
          trackingOnClick={trackingOnClick}
        />
      </OakBox>
      <OakBox $display={["block", "none"]}>
        <KeyPadGrid
          keyStages={keyStagesMobileOrder}
          years={years}
          ksButtonSpan={3}
          trackingOnClick={trackingOnClick}
        />
      </OakBox>
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
          <OakUL
            $reset
            $display={"flex"}
            $mb={years ? "space-between-l" : "space-between-m"}
            $ph="inner-padding-xs"
          >
            {years.map((years) => (
              <OakLI
                $width={"100%"}
                key={`year:${years.title}`}
                $mr={"space-between-m"}
              >
                <KeypadLink
                  key={`year:${years.title}`}
                  {...years}
                  trackingOnClick={trackingOnClick}
                />
              </OakLI>
            ))}
          </OakUL>
        </>
      )}
    </nav>
  );
};

export default KeyStageKeypad;
