import { useEffect, useId, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {
  OakBox,
  OakFlex,
  OakCheckBox,
  OakIcon,
  OakP,
  OakPrimaryButton,
  OakScreenReader,
  OakSecondaryButton,
  OakUL,
  parseFontSize,
  parseLineHeight,
  type OakUiRoleToken,
  parseDropShadow,
  parseSpacing,
} from "@oaknational/oak-components";

export type MultiSelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

export type MultiSelectGroup = {
  /** Background colour used by selected tags from this group. */
  tagBackground?: OakUiRoleToken;
  label: string;
  options: MultiSelectOption[];
  value: string;
};

export type MultiSelectProps = {
  disabled?: boolean;
  dropdownDirection?: "down" | "up";
  groups: MultiSelectGroup[];
  id?: string;
  groupSelectLabel?: (group: MultiSelectGroup) => string;
  mobileConfirmLabel?: string;
  hideMobileHeader?: boolean;
  mobileTitle?: string;
  onChange: (values: string[]) => void;
  onMobileClose?: () => void;
  onMobileConfirm?: () => void;
  placeholder?: string;
  removeLabel?: (option: MultiSelectOption, group: MultiSelectGroup) => string;
  selectedItemsLabel?: string;
  selectedValues: string[];
  selectAllLabel?: string;
  size?: "standard" | "large";
  unselectAllLabel?: string;
  "data-testid"?: string;
};

// OakCheckBox does not expose a minimum-height prop for its label.
const CheckboxStack = styled(OakFlex)`
  label {
    min-height: ${parseSpacing("spacing-32")};
  }
`;

// The tag's 14px regular type has no exact Oak font token.
const ChipButton = styled(OakFlex)`
  font: inherit;
  font-size: ${parseFontSize("body-3")};
  font-weight: 400;
  line-height: ${parseLineHeight("heading-7")};
  cursor: pointer;

  &:focus-visible {
    outline: 0;
    box-shadow: ${parseDropShadow("drop-shadow-centered-lemon")},
      ${parseDropShadow("drop-shadow-centered-grey")};
  }

  &:hover {
    text-decoration: underline;
  }
`;

const IconButton = styled(OakFlex)`
  cursor: pointer;

  &:focus-visible {
    outline: 0;
    box-shadow: ${parseDropShadow("drop-shadow-centered-lemon")},
      ${parseDropShadow("drop-shadow-centered-grey")};
  }
`;

const uniqueValues = (values: string[]) => [...new Set(values)];

const triggerSizeProps = {
  standard: { pv: "spacing-12" },
  large: { pv: "spacing-16" },
} as const;

const dropdownPositionProps = {
  down: { $top: `calc(100% + ${parseSpacing("spacing-4")})` },
  up: { $bottom: `calc(100% + ${parseSpacing("spacing-4")})` },
};

export const MultiSelect = ({
  disabled = false,
  dropdownDirection = "down",
  groups,
  id: idProp,
  groupSelectLabel = (group) => `All ${group.label.toLowerCase()} options`,
  hideMobileHeader = false,
  mobileConfirmLabel = "Confirm selection",
  mobileTitle,
  onChange,
  onMobileClose,
  onMobileConfirm,
  placeholder = "Select options",
  removeLabel = (option) => `Remove ${option.label}`,
  selectedItemsLabel = "Selected options",
  selectedValues,
  selectAllLabel = "Select all",
  size = "standard",
  unselectAllLabel = "Unselect all",
  "data-testid": dataTestId,
}: MultiSelectProps) => {
  const effectiveMobileTitle = mobileTitle ?? placeholder;
  const generatedId = useId();
  const id = idProp ?? `oak-multiselect-${generatedId.replace(/:/g, "")}`;
  const panelId = `${id}-panel`;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const options = useMemo(
    () => groups.flatMap((group) => group.options),
    [groups],
  );
  const selectableValues = useMemo(
    () => options.filter(({ disabled }) => !disabled).map(({ value }) => value),
    [options],
  );
  const selectedSet = useMemo(
    () => new Set(uniqueValues(selectedValues)),
    [selectedValues],
  );

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const emit = (values: string[]) => onChange(uniqueValues(values));

  const toggleValue = (value: string) => {
    emit(
      selectedSet.has(value)
        ? selectedValues.filter((selected) => selected !== value)
        : [...selectedValues, value],
    );
  };

  const toggleGroup = (group: MultiSelectGroup) => {
    const groupValues = group.options
      .filter(({ disabled: optionDisabled }) => !optionDisabled)
      .map(({ value }) => value);
    const groupIsSelected = groupValues.every((value) =>
      selectedSet.has(value),
    );
    emit(
      groupIsSelected
        ? selectedValues.filter((value) => !groupValues.includes(value))
        : [...selectedValues, ...groupValues],
    );
  };

  const renderOptions = (mobile = false) => (
    <OakBox
      as="fieldset"
      $minWidth="spacing-0"
      $ma="spacing-0"
      $pa="spacing-0"
      $ba="border-solid-none"
      disabled={disabled}
    >
      <OakScreenReader as="legend">{placeholder}</OakScreenReader>
      <CheckboxStack $flexDirection="column" $gap="spacing-16">
        <OakCheckBox
          id={`${id}-${mobile ? "mobile-" : ""}select-all`}
          value={selectAllLabel}
          checked={
            selectableValues.length > 0 &&
            selectableValues.every((value) => selectedSet.has(value))
          }
          onChange={() => emit([...selectedValues, ...selectableValues])}
          disabled={disabled}
        />
        <OakCheckBox
          id={`${id}-${mobile ? "mobile-" : ""}unselect-all`}
          value={unselectAllLabel}
          checked={selectedSet.size === 0}
          onChange={() => emit([])}
          disabled={disabled}
        />
      </CheckboxStack>
      {groups.map((group) => {
        const groupValues = group.options
          .filter(({ disabled: optionDisabled }) => !optionDisabled)
          .map(({ value }) => value);
        const groupIsSelected =
          groupValues.length > 0 &&
          groupValues.every((value) => selectedSet.has(value));

        return (
          <div key={`${mobile ? "mobile-" : ""}${group.value}`}>
            <OakP
              $font="heading-7"
              $mt="spacing-20"
              $mb="spacing-16"
              $mh="spacing-0"
            >
              {group.label}
            </OakP>
            <CheckboxStack $flexDirection="column" $gap="spacing-16">
              {mobile ? (
                <OakCheckBox
                  id={`${id}-mobile-${group.value}-all`}
                  value={groupSelectLabel(group)}
                  checked={groupIsSelected}
                  onChange={() => toggleGroup(group)}
                  disabled={disabled || groupValues.length === 0}
                />
              ) : null}
              {group.options.map((option) => (
                <OakCheckBox
                  key={option.value}
                  id={`${id}-${mobile ? "mobile-" : ""}${option.value}`}
                  value={option.label}
                  checked={selectedSet.has(option.value)}
                  onChange={() => toggleValue(option.value)}
                  disabled={disabled || option.disabled}
                />
              ))}
            </CheckboxStack>
          </div>
        );
      })}
    </OakBox>
  );

  const selectedGroups = groups
    .map((group) => ({
      ...group,
      options: group.options.filter(({ value }) => selectedSet.has(value)),
    }))
    .filter(({ options: groupOptions }) => groupOptions.length > 0);

  return (
    <OakBox
      $position="relative"
      $width="100%"
      ref={rootRef}
      data-testid={dataTestId}
    >
      <OakBox $display={["none", "none", "block"]}>
        <OakBox $position="relative" $width="100%">
          <OakSecondaryButton
            width="100%"
            innerWidth="100%"
            {...triggerSizeProps[size]}
            hoverUnderline={false}
            isTrailingIcon
            iconOverride={
              <OakIcon
                iconName={isOpen ? "chevron-up" : "chevron-down"}
                $color={disabled ? "icon-disabled" : "icon-primary"}
                $ml="auto"
              />
            }
            id={id}
            type="button"
            data-testid={dataTestId ? `${dataTestId}-trigger` : undefined}
            aria-controls={panelId}
            aria-expanded={isOpen}
            disabled={disabled}
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setIsOpen((open) => !open);
            }}
          >
            {placeholder}
          </OakSecondaryButton>
          {isOpen ? (
            <OakBox
              $position="absolute"
              $right="spacing-0"
              $left="spacing-0"
              $zIndex={20}
              $boxSizing="border-box"
              $maxHeight={`min(${parseSpacing("spacing-960")}, 70vh)`}
              $overflowY="auto"
              $ba="border-solid-xl"
              $borderColor="border-primary"
              $borderRadius="border-radius-s"
              $background="bg-primary"
              $pa="spacing-12"
              {...dropdownPositionProps[dropdownDirection]}
              id={panelId}
              aria-label={placeholder}
              data-testid={dataTestId ? `${dataTestId}-panel` : undefined}
            >
              {renderOptions()}
            </OakBox>
          ) : null}
        </OakBox>
        {selectedGroups.length > 0 ? (
          <OakFlex
            $flexDirection="column"
            $gap="spacing-32"
            $mt="spacing-40"
            aria-label={selectedItemsLabel}
          >
            {selectedGroups.map((group) => (
              <OakFlex
                $flexDirection="column"
                $gap="spacing-16"
                key={group.value}
              >
                <OakP $font="heading-7" $mv="spacing-0">
                  {group.label}
                </OakP>
                <OakUL
                  $reset
                  $display="flex"
                  $flexWrap="wrap"
                  $columnGap="spacing-8"
                  $rowGap="spacing-16"
                >
                  {group.options.map((option) => (
                    <li key={option.value}>
                      <ChipButton
                        as="button"
                        $display="inline-flex"
                        $alignItems="center"
                        $gap="spacing-8"
                        $pv="spacing-4"
                        $ph="spacing-8"
                        $ba="border-solid-none"
                        $borderRadius="border-radius-m"
                        $color="text-primary"
                        type="button"
                        $background={
                          group.tagBackground ?? "bg-decorative2-main"
                        }
                        aria-label={removeLabel(option, group)}
                        data-testid={
                          dataTestId
                            ? `${dataTestId}-remove-${option.value}`
                            : undefined
                        }
                        onClick={() => toggleValue(option.value)}
                        disabled={disabled}
                      >
                        {option.label}
                        <OakIcon
                          iconName="cross"
                          $width="spacing-16"
                          $height="spacing-16"
                        />
                      </ChipButton>
                    </li>
                  ))}
                </OakUL>
              </OakFlex>
            ))}
          </OakFlex>
        ) : null}
      </OakBox>

      <OakBox
        $display={["block", "block", "none"]}
        $width="100%"
        $background="bg-primary"
      >
        {!hideMobileHeader ? (
          <OakFlex
            $alignItems="center"
            $justifyContent="space-between"
            $minHeight="spacing-64"
            $pv="spacing-12"
            $ph="spacing-16"
            $background="bg-decorative5-subdued"
          >
            <OakP $font="heading-7" $mv="spacing-0">
              {effectiveMobileTitle}
            </OakP>
            {onMobileClose ? (
              <IconButton
                as="button"
                $display="inline-flex"
                $alignItems="center"
                $justifyContent="center"
                $width="spacing-40"
                $height="spacing-40"
                $pa="spacing-0"
                $ba="border-solid-none"
                $borderRadius="border-radius-s"
                $background="transparent"
                $color="text-primary"
                type="button"
                aria-label={`Close ${effectiveMobileTitle}`}
                onClick={onMobileClose}
              >
                <OakIcon iconName="cross" />
              </IconButton>
            ) : null}
          </OakFlex>
        ) : null}
        <OakBox $pt="spacing-20" $ph="spacing-16" $pb="spacing-100">
          {renderOptions(true)}
        </OakBox>
        <OakFlex
          $position="sticky"
          $bottom="spacing-0"
          $alignItems="center"
          $minHeight="spacing-72"
          $pv="spacing-12"
          $ph="spacing-16"
          $bt="border-solid-s"
          $borderColor="border-neutral-lighter"
          $background="bg-primary"
        >
          <OakPrimaryButton
            width="100%"
            hoverUnderline={false}
            hoverShadow={null}
            isTrailingIcon
            iconOverride={
              <OakIcon iconName="arrow-right" $color="icon-inverted" />
            }
            type="button"
            disabled={disabled || selectedSet.size === 0}
            onClick={onMobileConfirm}
            data-testid={
              dataTestId ? `${dataTestId}-mobile-confirm` : undefined
            }
          >
            {mobileConfirmLabel}
          </OakPrimaryButton>
        </OakFlex>
      </OakBox>
    </OakBox>
  );
};
