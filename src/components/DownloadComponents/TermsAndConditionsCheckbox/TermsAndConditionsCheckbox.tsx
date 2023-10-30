import { FC } from "react";

import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import Checkbox from "@/components/Checkbox";
import Box from "@/components/Box";
import FieldError from "@/components/FormFields/FieldError";
import { CheckboxProps } from "@/components/Checkbox/Checkbox";

export type TermsAndConditionsCheckboxProps = CheckboxProps & {
  errorMessage?: string;
};

const TermsAndConditionsCheckbox: FC<TermsAndConditionsCheckboxProps> = ({
  checked,
  onChange,
  errorMessage,
  ...props
}) => (
  <>
    <Box
      $position={"relative"}
      $background={"oakGrey30"}
      $pv={8}
      $ph={8}
      $mb={24}
      data-testid="termsCheckbox"
    >
      <BrushBorders hideOnMobileH hideOnMobileV color={"oakGrey30"} />
      <Checkbox
        labelText={"I accept terms and conditions (required)"}
        checked={checked}
        onChange={onChange}
        $mb={0}
        required
        error={errorMessage}
        hasError={Boolean(errorMessage)}
        variant="withLabel"
        {...props}
      />
    </Box>
    {errorMessage && (
      <Box $mb={16}>
        <FieldError id={"terms-error"} withoutMarginBottom>
          {errorMessage}
        </FieldError>
      </Box>
    )}
  </>
);

export default TermsAndConditionsCheckbox;
