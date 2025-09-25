import { FC, ReactNode, useState } from "react";
import {
  OakFlex,
  OakIcon,
  OakBox,
  OakTertiaryInvertedButton,
  OakSpan,
} from "@oaknational/oak-components";

export interface MiniDropdownProps {
  label: string;
  isToggleOpen?: boolean; // Optional for uncontrolled mode
  defaultOpen?: boolean; // Default state for uncontrolled mode
  isHovered?: boolean;
  children: ReactNode;
  onToggle?: (isOpen: boolean) => void;
  id?: string;
}

const MiniDropdown: FC<MiniDropdownProps> = ({
  label,
  isToggleOpen,
  defaultOpen = false,
  isHovered = false,
  children,
  onToggle,
  id,
}) => {
  // Use internal state if not controlled
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  // Determine if component is controlled or uncontrolled
  const isControlled = isToggleOpen !== undefined;
  const isOpen = isControlled ? isToggleOpen : internalIsOpen;

  const handleToggle = () => {
    const newIsOpen = !isOpen;

    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalIsOpen(newIsOpen);
    }

    // Call onToggle callback with new state
    onToggle?.(newIsOpen);
  };

  const dropdownId =
    id || `mini-dropdown-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const contentId = `${dropdownId}-content`;

  return (
    <OakFlex $flexDirection={"column"} $justifyContent={"center"}>
      <OakTertiaryInvertedButton
        onClick={handleToggle}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={`${label} dropdown, ${isOpen ? "expanded" : "collapsed"}`}
      >
        <OakFlex
          $flexDirection={"row"}
          $alignContent={"center"}
          $justifyContent={"center"}
          $alignItems={"center"}
        >
          <OakSpan
            $font="heading-7"
            $color={isOpen ? "navy120" : "navy"}
            $textDecoration={isHovered && !isOpen ? "underline" : "none"}
            $textAlign={"center"}
          >
            {label}
          </OakSpan>
          <OakIcon
            iconName={isOpen ? "chevron-up" : "chevron-down"}
            $colorFilter={isOpen ? "navy120" : "navy"}
            $width="all-spacing-6"
            aria-hidden="true"
          />
        </OakFlex>
      </OakTertiaryInvertedButton>
      <OakBox
        id={contentId}
        $display={isOpen ? "block" : "none"}
        $transition="standard-ease"
        role="region"
        aria-labelledby={dropdownId}
      >
        {children}
      </OakBox>
    </OakFlex>
  );
};

export default MiniDropdown;
