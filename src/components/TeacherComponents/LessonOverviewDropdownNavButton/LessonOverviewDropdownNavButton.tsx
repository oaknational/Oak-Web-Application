import React, { useState, useRef, useEffect } from "react";
import {
  OakBox,
  OakFlex,
  OakIcon,
  OakIconName,
  OakSmallPrimaryInvertedButton,
  OakSmallSecondaryButton,
  OakTagFunctional,
} from "@oaknational/oak-components";

export type LessonOverviewDropdownNavButtonItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
  iconName?: OakIconName;
};

export type LessonOverviewDropdownNavButtonProps = {
  primaryActionText: string;
  primaryActionIcon?: OakIconName;
  onPrimaryAction?: () => void;
  items: LessonOverviewDropdownNavButtonItem[];
  footer?: React.ReactNode;
  leadingItemIcon?: OakIconName;
  isPrimaryActionLoading?: boolean;
  isPrimaryActionDisabled?: boolean;
  ariaLabel?: string;
  isNew?: boolean;
  ariaDescription?: string;
  "data-testid"?: string;
};

/**
 * A flexible component that displays a primary action button and a list of items/resources.
 * Can be used for additional materials, resources, tools, or any similar content structure.
 * Supports customizable text, icons, and accessibility features.
 */
export const LessonOverviewDropdownNavButton = ({
  primaryActionText,
  primaryActionIcon = "chevron-down",
  onPrimaryAction,
  items,
  footer,
  leadingItemIcon,
  isPrimaryActionLoading = false,
  isPrimaryActionDisabled = false,
  ariaLabel,
  ariaDescription,
  isNew = false,
  "data-testid": dataTestId,
}: LessonOverviewDropdownNavButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get all focusable elements within the dropdown
  const getFocusableElements = () => {
    if (!dropdownRef.current) return [];
    return Array.from(
      dropdownRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ) as HTMLElement[];
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      const focusableElements = getFocusableElements();
      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement,
      );

      switch (event.key) {
        case "Escape": {
          event.preventDefault();
          setIsOpen(false);
          break;
        }

        case "ArrowDown": {
          event.preventDefault();
          if (focusableElements.length === 0) return;
          const nextDownIndex =
            currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
          focusableElements[nextDownIndex]?.focus();
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          if (focusableElements.length === 0) return;
          const nextUpIndex =
            currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
          focusableElements[nextUpIndex]?.focus();
          break;
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dataTestId]);

  const handlePrimaryAction = () => {
    setIsOpen(!isOpen);
    onPrimaryAction?.();
  };

  const handleItemClick = (item: LessonOverviewDropdownNavButtonItem) => {
    if (item.onClick) {
      item.onClick();
    }
    // Close dropdown when an item is clicked
    setIsOpen(false);
  };

  return (
    <OakBox
      as="section"
      aria-label={ariaLabel}
      aria-describedby={
        ariaDescription ? `${dataTestId}-description` : undefined
      }
      data-testid={dataTestId}
      ref={dropdownRef}
      $position="relative"
    >
      <OakFlex $flexDirection="column" $gap="space-between-xs">
        {/* Primary Action Button */}

        <OakFlex $gap="space-between-m">
          <OakSmallSecondaryButton
            iconName={primaryActionIcon}
            isTrailingIcon
            onClick={handlePrimaryAction}
            isLoading={isPrimaryActionLoading}
            disabled={isPrimaryActionDisabled}
            width="max-content"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-label={`${primaryActionText}${items.length > 0 ? `, ${items.length} item${items.length === 1 ? "" : "s"} available` : ""}`}
            data-testid={
              dataTestId ? `${dataTestId}-primary-action` : undefined
            }
          >
            <OakFlex $alignItems={"center"}>
              {isNew && (
                <OakTagFunctional // add size props
                  $ma={"space-between-sssx"}
                  $background={"lemon"}
                  label={"New"}
                />
              )}
              {primaryActionText}
            </OakFlex>
          </OakSmallSecondaryButton>
        </OakFlex>

        {isOpen && (
          <OakBox
            $background="bg-primary"
            $borderRadius="border-radius-s"
            $ba="border-solid-m"
            $borderColor="border-primary"
            $pa="inner-padding-m"
            $position="absolute"
            $top="all-spacing-8"
            $zIndex="modal-close-button"
            role="menu"
            aria-label={`Additional materials menu with ${items.length} item${items.length === 1 ? "" : "s"}. Use arrow keys to navigate, Tab to cycle through items, Escape to close.`}
            data-testid={dataTestId ? `${dataTestId}-dropdown` : undefined}
          >
            <OakFlex
              $flexDirection="column"
              $mb={footer ? "space-between-s" : "space-between-none"}
              $gap={"space-between-ssx"}
            >
              {items.map((item, index) => (
                <OakSmallPrimaryInvertedButton
                  key={index}
                  element={item.href ? "a" : "button"}
                  href={item.href}
                  onClick={item.href ? undefined : () => handleItemClick(item)}
                  iconName={item.iconName || "external"}
                  isTrailingIcon
                  role="menuitem"
                  aria-label={item.ariaLabel || `Create a  ${item.label}`}
                  data-testid={
                    dataTestId ? `${dataTestId}-item-${index}` : undefined
                  }
                  {...(item.href && {
                    target: "_blank",
                  })}
                >
                  <OakFlex $justifyContent={"center"} $alignItems={"center"}>
                    {leadingItemIcon && (
                      <OakIcon
                        $height={"all-spacing-6"}
                        iconName={leadingItemIcon}
                      />
                    )}
                    {item.label}
                  </OakFlex>
                </OakSmallPrimaryInvertedButton>
              ))}
            </OakFlex>

            {/* Footer Section */}
            {footer && (
              <>
                {/* Divider Line */}
                <OakBox
                  $height="all-spacing-0"
                  $width="100%"
                  $ba="border-solid-s"
                  $borderColor="border-neutral"
                  $mb="space-between-s"
                  role="separator"
                  aria-hidden="true"
                />

                {footer}
              </>
            )}
          </OakBox>
        )}
      </OakFlex>
    </OakBox>
  );
};
