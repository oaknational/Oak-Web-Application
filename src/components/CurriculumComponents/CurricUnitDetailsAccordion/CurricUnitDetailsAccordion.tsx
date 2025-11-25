import { useState } from "react";
import { useFocusVisible, useFocusWithin } from "react-aria";
import { OakFlex, OakIcon, OakBox } from "@oaknational/oak-components";
import { snakeCase } from "lodash";

import useClickableCard from "@/hooks/useClickableCard";
import Button from "@/components/SharedComponents/Button";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";

export type AccordionContainerTitles =
  | "Lessons in unit"
  | "Previous unit description"
  | "Following unit description"
  | "Description"
  | "Why this why now"
  | "Prior knowledge requirements";

type CurriculumUnitDetailsAccordionProps = {
  title: AccordionContainerTitles;
  children: React.ReactNode;
  lastAccordion?: boolean;
  handleUnitOverviewExploredAnalytics: (
    componentType: ComponentTypeValueType,
  ) => void;
};

export default function CurricUnitDetailsAccordion({
  title,
  children,
  lastAccordion,
  handleUnitOverviewExploredAnalytics,
}: Readonly<CurriculumUnitDetailsAccordionProps>) {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);

  const { isFocusVisible } = useFocusVisible();
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setIsFocused,
  });

  return (
    <OakFlex
      $flexDirection={"column"}
      $flexGrow={1}
      $position={"relative"}
      data-testid="accordion-component"
    >
      <OakFlex
        {...containerProps}
        $flexDirection={"row"}
        $flexGrow={0}
        $position={"relative"}
        $justifyContent={"space-between"}
        $pv={"spacing-24"}
      >
        <h3 style={{ display: "contents" }}>
          <Button
            {...focusWithinProps}
            {...primaryTargetProps}
            data-testid={"expand-accordian-button"}
            variant="buttonStyledAsLink"
            aria-expanded={isToggleOpen}
            label={title}
            isCurrent={isHovered}
            currentStyles={["underline"]}
            onClick={() => {
              setIsToggleOpen(!isToggleOpen);
              handleUnitOverviewExploredAnalytics(
                snakeCase(title) as ComponentTypeValueType,
              );
            }}
            $font={"heading-6"}
          />
          <OakIcon
            iconName={isToggleOpen ? "chevron-up" : "chevron-down"}
            $width={"spacing-24"}
            $height={"spacing-24"}
          />
        </h3>
      </OakFlex>
      {/* @todo replace with OakFlex - work out $maxHeight, why is it  OakFlex if it has display set to either block or none? */}
      <OakFlex
        data-testid={"accordion-container"}
        style={{ maxHeight: isToggleOpen ? 9600 : 0 }}
        $transition={"standard-ease"}
        $display={isToggleOpen ? "block" : "none"}
      >
        {children}
      </OakFlex>
      <BoxBorders hideLeft hideRight hideBottom={!lastAccordion || isFocused} />
      {isFocused && isFocusVisible && (
        <OakBox
          $position={"absolute"}
          $height={"spacing-4"}
          $width={"100%"}
          $bottom={"spacing-0"}
          $zIndex={"in-front"}
        >
          <OakIcon
            iconName="underline-1"
            $width={"100%"}
            $height={"100%"}
            $position={"absolute"}
            $top={"spacing-0"}
            $objectFit={"fill"}
          />
          <OakIcon
            iconName="underline-1"
            $width={"100%"}
            $height={"100%"}
            $position={"absolute"}
            $top={"spacing-4"}
            $objectFit={"fill"}
          />
          <OakIcon
            iconName="underline-1"
            $colorFilter={"lemon"}
            $width={"100%"}
            $height={"100%"}
            $position={"absolute"}
            $top={"spacing-2"}
            $objectFit={"fill"}
          />
        </OakBox>
      )}
    </OakFlex>
  );
}
