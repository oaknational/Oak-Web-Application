import { FC, useState, useEffect } from "react";

import useClickableCard from "@/hooks/useClickableCard";
import Card from "@/components/Card";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Svg from "@/components/Svg";

export type AccordionContainerTitles =
  | "Lessons in unit"
  | "Previous unit description"
  | "Following unit description";

type AccordionProps = {
  title: AccordionContainerTitles;
  toggleClosed?: boolean;
  children: React.ReactNode;
  lastAccordion?: boolean;
};

const Accordion: FC<AccordionProps> = ({
  title,
  children,
  toggleClosed = true,
  lastAccordion,
}) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();

  const [toggleOpen, setToggleOpen] = useState<boolean>(toggleClosed);

  useEffect(() => {
    setToggleOpen(true);
  }, [toggleClosed]);

  return (
    <Card
      $flexDirection={"column"}
      $pv={0}
      $ph={0}
      $mv={-1}
      $position={"relative"}
    >
      <Svg name="button-border-top" $height={2} />
      <Card {...containerProps} $flexGrow={0}>
        <Flex $justifyContent={"space-between"}>
          <Button
            {...primaryTargetProps}
            data-testid={"expand-accordian-button"}
            variant="buttonStyledAsLink"
            aria-expanded={!toggleOpen}
            label={title}
            isCurrent={isHovered}
            currentStyles={["underline"]}
            onClick={() => {
              setToggleOpen(!toggleOpen);
            }}
            $font={"heading-6"}
          />
          <Icon
            $color="black"
            name={toggleOpen ? "chevron-down" : "chevron-up"}
          />
        </Flex>
      </Card>
      <Flex
        data-testid={"accordion-container"}
        $maxHeight={toggleOpen ? 0 : 9600}
        $overflowY={"hidden"}
        $transition={"all 0.3s ease"}
        $visibility={toggleOpen ? "hidden" : "visible"}
        $mb={!toggleOpen ? 24 : 0}
        $ph={24}
      >
        {children}
      </Flex>
      <Svg
        name="button-border-bottom"
        $height={2}
        $mb={lastAccordion ? 24 : 0}
      />
    </Card>
  );
};

export default Accordion;
