import {
  OakFlex,
  OakJauntyAngleLabel,
  OakTextInput,
} from "@oaknational/oak-components";
import { useMemo, useState, useEffect, ChangeEvent } from "react";

function stringIsValidNumber(value: string, min: number, max: number) {
  if (!value.trim().match(/^[0-9]+$/)) return false;
  const num = parseInt(value, 10);
  if (Number.isNaN(num)) return false;
  return num >= min && num <= max;
}

export interface CurricNumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  ariaDescribedBy?: string;
  min?: number;
  max?: number;
  step?: number;
  onValidationChange?: (isValid: boolean) => void;
}

export function CurricNumberInput({
  id,
  label,
  value,
  onChange,
  ariaDescribedBy,
  min = 5,
  max = 35,
  step = 1,
  onValidationChange,
}: CurricNumberInputProps) {
  const [dirtyValue, setDirtyValue] = useState(String(value));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const strValue = e.target?.value;
    const newValue = parseInt(strValue, 10);
    setDirtyValue(strValue);
    if (stringIsValidNumber(strValue, min, max)) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    setDirtyValue(String(value));
  }, [value]);

  const isErroring = useMemo(
    () => !stringIsValidNumber(dirtyValue, min, max),
    [dirtyValue, min, max],
  );

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(!isErroring);
    }
  }, [isErroring, onValidationChange]);

  const handleBlur = () => {
    if (!stringIsValidNumber(dirtyValue, min, max)) {
      setDirtyValue(String(value));
    }
  };

  return (
    <OakFlex $position="relative" $flexDirection="column">
      <OakJauntyAngleLabel
        as="label"
        htmlFor={id}
        label={label}
        $font="heading-7"
        $background="lemon"
        $color="black"
        $zIndex="in-front"
        $position="absolute"
        $top={"-20px"}
        $left={"5px"}
        $borderRadius="border-radius-square"
        data-testid="jaunty-label"
      />
      <OakTextInput
        id={id}
        data-testid="text-input"
        type="number"
        min={min}
        max={max}
        step={step}
        value={dirtyValue}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby={ariaDescribedBy}
        wrapperWidth="100%"
        $pv="inner-padding-none"
        $height="all-spacing-10"
        borderColor={isErroring ? "red" : undefined}
        background={isErroring ? "red30" : undefined}
      />
    </OakFlex>
  );
}
