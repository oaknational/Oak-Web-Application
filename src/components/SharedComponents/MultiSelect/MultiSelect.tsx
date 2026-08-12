import { useEffect, useId, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import {
  OakCheckBox,
  OakIcon,
  OakP,
  type OakUiRoleToken,
  parseColor,
  parseDropShadow,
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

const Root = styled.div`
  position: relative;
  width: 100%;
`;

const DesktopView = styled.div`
  display: none;

  @media (min-width: 750px) {
    display: block;
  }
`;

const Trigger = styled.button<{ $size: "standard" | "large" }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: ${({ $size }) => ($size === "large" ? "64px" : "48px")};
  padding: ${({ $size }) => ($size === "large" ? "16px" : "12px 16px")};
  border: 2px solid ${parseColor("border-primary")};
  border-radius: 4px;
  background: ${parseColor("bg-primary")};
  color: ${parseColor("text-primary")};
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -1px;
  text-align: left;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${parseColor("bg-neutral")};
    box-shadow: ${parseDropShadow("drop-shadow-lemon")};
  }

  &:focus-visible {
    outline: 0;
    box-shadow: ${parseDropShadow("drop-shadow-centered-lemon")},
      ${parseDropShadow("drop-shadow-centered-grey")};
  }

  &:active:not(:disabled) {
    background: ${parseColor("bg-primary")};
    box-shadow: ${parseDropShadow("drop-shadow-lemon")},
      ${parseDropShadow("drop-shadow-grey")};
  }

  &:disabled {
    border-color: ${parseColor("border-neutral")};
    background: ${parseColor("bg-neutral-stronger")};
    color: ${parseColor("text-disabled")};
    cursor: not-allowed;
  }
`;

const DropdownPanel = styled.div<{ $direction: "down" | "up" }>`
  position: absolute;
  right: 0;
  left: 0;
  z-index: 20;
  box-sizing: border-box;
  max-height: min(1016px, 70vh);
  overflow-y: auto;
  border: 4px solid ${parseColor("border-primary")};
  border-radius: 4px;
  background: ${parseColor("bg-primary")};
  padding: 12px;
  ${({ $direction }) =>
    $direction === "up"
      ? css`
          bottom: calc(100% + 4px);
        `
      : css`
          top: calc(100% + 4px);
        `}
`;

const OptionsFieldset = styled.fieldset`
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
`;

const CheckboxStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  label {
    min-height: 28px;
  }
`;

const GroupHeading = styled(OakP)`
  margin: 20px 0 16px;
`;

const ChipGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;

const ChipGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChipList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ChipButton = styled.button<{ $background: OakUiRoleToken }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
  padding: 4px 8px;
  border: 0;
  border-radius: 6px;
  background: ${({ $background }) => parseColor($background)};
  color: ${parseColor("text-primary")};
  font: inherit;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
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

const MobileView = styled.div`
  display: block;
  width: 100%;
  background: ${parseColor("bg-primary")};

  @media (min-width: 750px) {
    display: none;
  }
`;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 12px 16px;
  background: ${parseColor("bg-decorative5-subdued")};
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: ${parseColor("text-primary")};
  cursor: pointer;

  &:focus-visible {
    outline: 0;
    box-shadow: ${parseDropShadow("drop-shadow-centered-lemon")},
      ${parseDropShadow("drop-shadow-centered-grey")};
  }
`;

const MobileOptions = styled.div`
  padding: 20px 16px 96px;
`;

const MobileConfirm = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  min-height: 72px;
  padding: 12px 16px;
  border-top: 1px solid ${parseColor("border-neutral-lighter")};
  background: ${parseColor("bg-primary")};
`;

const ConfirmButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 48px;
  padding: 12px 16px;
  border: 2px solid ${parseColor("border-primary")};
  border-radius: 4px;
  background: ${parseColor("bg-btn-primary")};
  color: ${parseColor("text-inverted")};
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;

  &:disabled {
    border-color: ${parseColor("border-neutral")};
    background: ${parseColor("bg-btn-primary-disabled")};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 0;
    box-shadow: ${parseDropShadow("drop-shadow-centered-lemon")},
      ${parseDropShadow("drop-shadow-centered-grey")};
  }
`;

const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Legend = styled.legend`
  ${visuallyHidden}
`;

const uniqueValues = (values: string[]) => [...new Set(values)];

export const MultiSelect = ({
  disabled = false,
  dropdownDirection = "down",
  groups,
  id: idProp,
  groupSelectLabel = (group) => `All ${group.label.toLowerCase()} options`,
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
  const triggerRef = useRef<HTMLButtonElement>(null);
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
    <OptionsFieldset disabled={disabled}>
      <Legend>{placeholder}</Legend>
      <CheckboxStack>
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
            <GroupHeading $font="heading-7">{group.label}</GroupHeading>
            <CheckboxStack>
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
    </OptionsFieldset>
  );

  const selectedGroups = groups
    .map((group) => ({
      ...group,
      options: group.options.filter(({ value }) => selectedSet.has(value)),
    }))
    .filter(({ options: groupOptions }) => groupOptions.length > 0);

  return (
    <Root ref={rootRef} data-testid={dataTestId}>
      <DesktopView>
        <Trigger
          ref={triggerRef}
          id={id}
          type="button"
          $size={size}
          data-testid={dataTestId ? `${dataTestId}-trigger` : undefined}
          aria-controls={panelId}
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>{placeholder}</span>
          <OakIcon
            iconName={isOpen ? "chevron-up" : "chevron-down"}
            $color={disabled ? "icon-disabled" : "icon-primary"}
          />
        </Trigger>
        {isOpen ? (
          <DropdownPanel
            id={panelId}
            $direction={dropdownDirection}
            aria-label={placeholder}
            data-testid={dataTestId ? `${dataTestId}-panel` : undefined}
          >
            {renderOptions()}
          </DropdownPanel>
        ) : null}
        {selectedGroups.length > 0 ? (
          <ChipGroups aria-label={selectedItemsLabel}>
            {selectedGroups.map((group) => (
              <ChipGroup key={group.value}>
                <OakP $font="heading-7" $mv="spacing-0">
                  {group.label}
                </OakP>
                <ChipList>
                  {group.options.map((option) => (
                    <li key={option.value}>
                      <ChipButton
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
                </ChipList>
              </ChipGroup>
            ))}
          </ChipGroups>
        ) : null}
      </DesktopView>

      <MobileView>
        <MobileHeader>
          <OakP $font="heading-7" $mv="spacing-0">
            {effectiveMobileTitle}
          </OakP>
          {onMobileClose ? (
            <IconButton
              type="button"
              aria-label={`Close ${effectiveMobileTitle}`}
              onClick={onMobileClose}
            >
              <OakIcon iconName="cross" />
            </IconButton>
          ) : null}
        </MobileHeader>
        <MobileOptions>{renderOptions(true)}</MobileOptions>
        <MobileConfirm>
          <ConfirmButton
            type="button"
            disabled={disabled || selectedSet.size === 0}
            onClick={onMobileConfirm}
            data-testid={
              dataTestId ? `${dataTestId}-mobile-confirm` : undefined
            }
          >
            {mobileConfirmLabel}
            <OakIcon iconName="arrow-right" $color="icon-inverted" />
          </ConfirmButton>
        </MobileConfirm>
      </MobileView>
    </Root>
  );
};
