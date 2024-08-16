import React from "react";
import { OakFlex, OakSpan } from "@oaknational/oak-components";

import { OakColorName } from "@/styles/theme";
import {
  RotatedInputLabel,
  StyledInput,
} from "@/components/SharedComponents/Input/Input";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";

type SchoolEntryInputBoxProps = {
  placeholder: string;
  background: OakColorName;
  labelText: string;
  hasError?: boolean;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SchoolEntryInputBox: React.FC<SchoolEntryInputBoxProps> = ({
  placeholder,
  background,
  labelText,
  onBlur,
  onChange,
  hasError,
}) => {
  return (
    <OakFlex $width={"100%"} $position={"relative"} $display={"inline-block"}>
      <BoxBorders gapPosition="rightTop" />
      <OakFlex $position={"absolute"}>
        <RotatedInputLabel
          $font={"heading-7"}
          background={hasError ? "red" : background}
          color="black"
        >
          <OakSpan $color={hasError ? "white" : "text-primary"}>
            {labelText}
            <OakSpan $font={"heading-light-7"}>(required)</OakSpan>
          </OakSpan>
        </RotatedInputLabel>
      </OakFlex>
      <StyledInput
        onBlur={onBlur}
        onChange={onChange}
        isRequired={true}
        placeholder={placeholder}
      />
    </OakFlex>
  );
};

export default SchoolEntryInputBox;
