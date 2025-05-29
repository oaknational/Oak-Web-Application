import { useState } from "react";
import { useFocusVisible, useFocusWithin } from "react-aria";
import { OakIcon, OakBox } from "@oaknational/oak-components";
import { snakeCase } from "lodash";

import useClickableCard from "@/hooks/useClickableCard";
import Card from "@/components/SharedComponents/Card";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Button from "@/components/SharedComponents/Button";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";

export type AccordionContainerTitles =
  | "Lessons in unit"
  | "Previous unit description"
  | "Following unit description"
  | "Description"
  | "Why this why now";

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
}: CurriculumUnitDetailsAccordionProps) {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);

  const { isFocusVisible } = useFocusVisible();
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setIsFocused,
  });

  return (
    <Card
      $flexDirection={"column"}
      $pv={0}
      $ph={0}
      $position={"relative"}
      data-testid="accordion-component"
    >
      <Card
        {...containerProps}
        $flexDirection={"row"}
        $flexGrow={0}
        $justifyContent={"space-between"}
        $ph={0}
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
            $width={"all-spacing-6"}
            $height={"all-spacing-6"}
          />
        </h3>
      </Card>
      {/* @todo replace with OakFlex - work out $maxHeight, why is it Flex if it has display set to either block or none? */}
      <Flex
        data-testid={"accordion-container"}
        $maxHeight={isToggleOpen ? 9600 : 0}
        $transition={"all 0.3s ease"}
        $display={isToggleOpen ? "block" : "none"}
      >
        {children}
      </Flex>
      <BoxBorders hideLeft hideRight hideBottom={!lastAccordion || isFocused} />

      {isFocused && isFocusVisible && (
        <OakBox
          $position={"absolute"}
          $height={"all-spacing-1"}
          $width={"100%"}
          $bottom={"all-spacing-0"}
          $zIndex={"in-front"}
        >
          <OakIcon
            iconName="underline-1"
            $width={"100%"}
            $height={"100%"}
            $position={"absolute"}
            $top={"all-spacing-0"}
            $objectFit={"fill"}
          />
          <OakIcon
            iconName="underline-1"
            $width={"100%"}
            $height={"100%"}
            $position={"absolute"}
            $top={"all-spacing-1"}
            $objectFit={"fill"}
          />
          <OakIcon
            iconName="underline-1"
            $colorFilter={"lemon"}
            $width={"100%"}
            $height={"100%"}
            $position={"absolute"}
            $top={"all-spacing-05"}
            $objectFit={"fill"}
          />
        </OakBox>
      )}
    </Card>
  );
}
