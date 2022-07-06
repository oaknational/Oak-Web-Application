import { FC, MouseEventHandler, useState } from "react";
import styled from "styled-components";

import IconButton from "../Button/IconButton";
import Flex from "../Flex";
import { IconName } from "../Icon";
import Heading, { HeadingTag } from "../Typography/Heading";

const Summary = styled.summary`
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
`;

const SummaryHeading = styled(Heading)`
  cursor: pointer;

  &:focus-within {
    outline: 5px auto -webkit-focus-ring-color;
  }
`;

type SummaryButton = {
  icon: IconName;
  onClick: MouseEventHandler;
  ariaLabel: string;
};

type CollapsibleSectionProps = {
  startOpen: boolean;
  title: string;
  headingTag: HeadingTag;
  buttons?: SummaryButton[];
};
/**
 * Clicking the title of the card, or the arrow icon will cause the collapse/expand behaviour
 * Pass in startOpen to set default behaviour (open/closed)
 * Pass in button array with [icon name, aria-label, onClick]
 */
const CollapsibleSection: FC<CollapsibleSectionProps> = ({
  startOpen = false,
  title,
  headingTag,
  children,
  buttons,
}) => {
  const [open, setOpen] = useState<boolean>(startOpen);

  const handleClick = (
    e: React.MouseEvent<
      HTMLInputElement | HTMLButtonElement | HTMLAnchorElement
    >
  ) => {
    e.preventDefault();
    setOpen((o) => !o);
  };
  return (
    <details {...(open ? { open: true } : {})}>
      <Summary>
        <Flex
          pa={24}
          flexDirection={"row"}
          justifyContent={"space-between"}
          background={"white"}
        >
          <SummaryHeading fontSize={24} tag={headingTag}>
            <a aria-expanded={open} onClick={(e) => handleClick(e)}>
              {title}
            </a>
          </SummaryHeading>
          <Flex>
            {buttons &&
              buttons.map((button) => (
                <IconButton
                  key={button.icon}
                  mh={12}
                  icon={button.icon}
                  aria-label={button.ariaLabel}
                  onClick={(e) => {
                    e.stopPropagation();
                    button.onClick(e);
                  }}
                />
              ))}
            <IconButton
              ml={12}
              aria-label={"Open collapsible section"}
              icon={open ? "ChevronRight" : "ArrowRight"}
              onClick={(e) => handleClick(e)}
              aria-expanded={open}
            />
          </Flex>
        </Flex>
      </Summary>
      {open && (
        <Flex background={"white"} ph={16} pb={16}>
          {children}
        </Flex>
      )}
    </details>
  );
};

export default CollapsibleSection;
