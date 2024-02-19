import { FC, MouseEventHandler, useState } from "react";
import styled from "styled-components";
import {
  OakHeading,
  OakHeadingTag,
  OakFlex,
} from "@oaknational/oak-components";

import { IconName } from "@/components/SharedComponents/Icon";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import Button from "@/components/SharedComponents/Button";

const Summary = styled.summary`
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }
`;

const SummaryHeading = styled(OakHeading)`
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
  children?: React.ReactNode;
  startOpen: boolean;
  title: string;
  headingTag: OakHeadingTag;
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
    >,
  ) => {
    e.preventDefault();
    setOpen((o) => !o);
  };
  return (
    <details
      onClick={(e) => {
        e.preventDefault();
      }}
      role="button"
      {...(open ? { open: true } : {})}
    >
      <Summary
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <OakFlex
          $pa="inner-padding-xl"
          $flexDirection={"row"}
          $justifyContent={"space-between"}
          $background={"white"}
        >
          <SummaryHeading $font={"heading-5"} tag={headingTag}>
            <Button
              variant="minimal"
              aria-expanded={open}
              onClick={(e) => handleClick(e)}
              label={title}
            />
          </SummaryHeading>
          <OakFlex>
            {buttons?.map((button) => (
              <IconButton
                key={button.icon}
                $mh={12}
                icon={button.icon}
                aria-label={button.ariaLabel}
                onClick={(e) => {
                  e.stopPropagation();
                  button.onClick(e);
                }}
              />
            ))}
            <IconButton
              $ml={12}
              aria-label={"Open collapsible section"}
              icon={"chevron-down"}
              onClick={(e) => handleClick(e)}
              rotate={open ? 180 : 0}
              aria-expanded={open}
            />
          </OakFlex>
        </OakFlex>
      </Summary>
      {open && (
        <OakFlex
          $background={"white"}
          $ph="inner-padding-m"
          $pb="inner-padding-m"
        >
          {children}
        </OakFlex>
      )}
    </details>
  );
};

export default CollapsibleSection;
