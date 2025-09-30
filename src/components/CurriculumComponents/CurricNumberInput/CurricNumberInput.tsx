import {
  OakBox,
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
  label: string;
  id: string;
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

export function CurricNumberInput({
  label,
  id,
  value,
  onChange,
  min = 5,
  max = 35,
}: CurricNumberInputProps) {
  const [dirtyValue, setDirtyValue] = useState(String(value));
  const onChangeLocal = (e: ChangeEvent<HTMLInputElement>) => {
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
  const onBlur = () => {
    if (!stringIsValidNumber(dirtyValue, min, max)) {
      setDirtyValue(String(value));
    }
  };

  return (
    <OakBox $position={"relative"}>
      <OakJauntyAngleLabel
        label={label}
        htmlFor={id}
        as="label"
        id={label + "-label"}
        $font={"heading-7"}
        $zIndex="in-front"
        $position="absolute"
        $top={"-20px"}
        $left={"5px"}
        $borderRadius="border-radius-square"
        data-testid="jaunty-label"
        $background="lemon"
      />
      <OakTextInput
        id={id}
        data-testid="text-input"
        type="number"
        min={min}
        max={max}
        onChange={onChangeLocal}
        onBlur={onBlur}
        $pv="inner-padding-none"
        wrapperWidth="100%"
        $height="all-spacing-10"
        value={dirtyValue}
        borderColor={isErroring ? "red" : undefined}
        background={isErroring ? "red30" : undefined}
      />
    </OakBox>
  );
}
