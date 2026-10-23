import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  OakBox,
  OakFlex,
  OakFocusIndicator,
  OakCheckBox,
  OakIcon,
  OakP,
  OakPrimaryButton,
  OakScreenReader,
  OakSecondaryButton,
  OakUL,
  type OakUiRoleToken,
} from "@oaknational/oak-components";

export type MultiSelectOption = {
  disabled?: boolean;
  label: string;
  mobileLabel?: string;
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

const uniqueValues = (values: string[]) => [...new Set(values)];

const triggerSizeProps = {
  standard: { pv: "spacing-12" },
  large: { pv: "spacing-16", height: "spacing-64" },
} as const;

const dropdownPositionProps = {
  down: {
    anchor: { $top: undefined, $bottom: "spacing-0" },
    panel: { $top: "spacing-4", $bottom: undefined },
  },
  up: {
    anchor: { $top: "spacing-0", $bottom: undefined },
    panel: { $top: undefined, $bottom: "spacing-4" },
  },
} as const;

const MultiSelectTriggerIcon = ({
  isOpen,
  disabled,
}: {
  isOpen: boolean;
  disabled: boolean;
}) => (
  <OakIcon
    iconName={isOpen ? "chevron-up" : "chevron-down"}
    $color={disabled ? "icon-disabled" : "icon-primary"}
    $ml="auto"
  />
);

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
  const checkboxProps =
    size === "large"
      ? {
          checkboxSize: "spacing-32" as const,
          $labelGap: "spacing-12" as const,
        }
      : {};

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
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
      <OakFlex $flexDirection="column" $gap="spacing-16">
        <OakCheckBox
          {...checkboxProps}
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
          {...checkboxProps}
          id={`${id}-${mobile ? "mobile-" : ""}unselect-all`}
          value={unselectAllLabel}
          checked={selectedSet.size === 0}
          onChange={() => emit([])}
          disabled={disabled}
        />
      </OakFlex>
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
            <OakFlex $flexDirection="column" $gap="spacing-16">
              {mobile ? (
                <OakCheckBox
                  {...checkboxProps}
                  id={`${id}-mobile-${group.value}-all`}
                  value={groupSelectLabel(group)}
                  checked={groupIsSelected}
                  onChange={() => toggleGroup(group)}
                  disabled={disabled || groupValues.length === 0}
                />
              ) : null}
              {group.options.map((option) => (
                <OakCheckBox
                  {...checkboxProps}
                  key={option.value}
                  id={`${id}-${mobile ? "mobile-" : ""}${option.value}`}
                  value={option.label}
                  displayValue={
                    mobile ? (option.mobileLabel ?? option.label) : option.label
                  }
                  checked={selectedSet.has(option.value)}
                  onChange={() => toggleValue(option.value)}
                  disabled={disabled || option.disabled}
                />
              ))}
            </OakFlex>
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
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          event.stopPropagation();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
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
              <MultiSelectTriggerIcon isOpen={isOpen} disabled={disabled} />
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
              {...dropdownPositionProps[dropdownDirection].anchor}
              $height="spacing-0"
              $width="100%"
              $zIndex={20}
            >
              <OakBox
                $position="absolute"
                {...dropdownPositionProps[dropdownDirection].panel}
                $right="spacing-0"
                $left="spacing-0"
                $maxHeight="spacing-480"
                $boxSizing="border-box"
                $overflowY="auto"
                $ba="border-solid-xl"
                $borderColor="border-primary"
                $borderRadius="border-radius-s"
                $background="bg-primary"
                $pa="spacing-12"
                id={panelId}
                aria-label={placeholder}
                data-testid={dataTestId ? `${dataTestId}-panel` : undefined}
              >
                {renderOptions()}
              </OakBox>
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
                      <OakFocusIndicator $borderRadius="border-radius-m">
                        <OakFlex
                          as="button"
                          $display="inline-flex"
                          $alignItems="center"
                          $gap="spacing-8"
                          $pv="spacing-4"
                          $ph="spacing-8"
                          $ba="border-solid-none"
                          $borderRadius="border-radius-m"
                          $color="text-primary"
                          $font="heading-light-7"
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
                        </OakFlex>
                      </OakFocusIndicator>
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
              <OakFocusIndicator $borderRadius="border-radius-s">
                <OakFlex
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
                </OakFlex>
              </OakFocusIndicator>
            ) : null}
          </OakFlex>
        ) : null}
        <OakBox
          $pt="spacing-20"
          $ph={size === "large" ? "spacing-12" : "spacing-16"}
          $pb="spacing-32"
        >
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
