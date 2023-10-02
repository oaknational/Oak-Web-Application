import { FC, useState } from "react";

import useClickableCard from "@/hooks/useClickableCard";
import Card from "@/components/Card";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Svg from "@/components/Svg";

export type AccordionContainerTitles =
  | "Lesson in unit"
  | "Previous unit description"
  | "Following unit description";

type AccordionProps = {
  title: AccordionContainerTitles;
  toggleClosed?: boolean;
  children: React.ReactNode;
};

const Accordion: FC<AccordionProps> = ({
  title,
  children,
  toggleClosed = true,
}) => {
  const { containerProps, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();

  const [toggleOpen, setToggleOpen] = useState<boolean>(toggleClosed);
  return (
    <Card $flexDirection={"column"} $ph={0} $pv={12}>
      {/* <Svg name="button-border-top" $height={2} /> */}
      <Card $pa={0} {...containerProps} $flexGrow={0}>
        <Flex $justifyContent={"space-between"} $mv={12}>
          <Button
            {...primaryTargetProps}
            data-testid={"expand-accordian-button"}
            variant="minimal"
            aria-expanded={!toggleOpen}
            label={title}
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
        data-testid={"expanded-container"}
        $maxHeight={toggleOpen ? 0 : 9600}
        $overflowY={"hidden"}
        $transition={"all 0.3s ease"}
        $visibility={toggleOpen ? "hidden" : "visible"}
      >
        {children}
      </Flex>
      <Svg name="button-border-bottom" $height={2} />
    </Card>
  );
};

export default Accordion;
