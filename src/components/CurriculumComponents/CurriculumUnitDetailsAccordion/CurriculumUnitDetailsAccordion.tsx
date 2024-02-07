import { FC, useState } from "react";
import { useFocusWithin } from "react-aria";

import useClickableCard from "@/hooks/useClickableCard";
import Card from "@/components/SharedComponents/Card";
import Flex from "@/components/SharedComponents/Flex";
import Icon from "@/components/SharedComponents/Icon";
import Button from "@/components/SharedComponents/Button";
import Svg from "@/components/SharedComponents/Svg";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import Box from "@/components/SharedComponents/Box";

export type AccordionContainerTitles =
  | "Lessons in unit"
  | "Previous unit description"
  | "Following unit description";

type CurriculumUnitDetailsAccordionProps = {
  title: AccordionContainerTitles;
  children: React.ReactNode;
  lastAccordion?: boolean;
};

const CurriculumUnitDetailsAccordion: FC<
  CurriculumUnitDetailsAccordionProps
> = ({ title, children, lastAccordion }) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isToggleOpen, setToggleOpen] = useState<boolean>(false);

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
            setToggleOpen(!isToggleOpen);
          }}
          $font={"heading-6"}
        />
        <Icon
          $color="black"
          name={isToggleOpen ? "chevron-up" : "chevron-down"}
        />
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

      {isFocused && (
        <Box
          $position={"absolute"}
          $height={4}
          $width={"100%"}
          $bottom={0}
          $zIndex={"inFront"}
        >
          <Svg
            name={"underline-1"}
            $color={"black"}
            $top={0}
            $position={"absolute"}
          />
          <Svg
            name={"underline-1"}
            $color={"black"}
            $top={4}
            $position={"absolute"}
          />
          <Svg
            name={"underline-1"}
            $color={"lemon"}
            $top={2}
            $position={"absolute"}
          />
        </Box>
      )}
    </Card>
  );
};

export default CurriculumUnitDetailsAccordion;
