import { FC } from "react";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import Checkbox from "@/components/SharedComponents/Checkbox";
import Box from "@/components/SharedComponents/Box";
import FieldError from "@/components/SharedComponents/FieldError";
import { CheckboxProps } from "@/components/SharedComponents/Checkbox/Checkbox";

export type ResourcePageTermsAndConditionsCheckboxProps = CheckboxProps & {
  errorMessage?: string;
};

const ResourcePageTermsAndConditionsCheckbox: FC<
  ResourcePageTermsAndConditionsCheckboxProps
> = ({ checked, onChange, errorMessage, ...props }) => (
  <>
    {errorMessage && (
      <Box $mb={16}>
        <FieldError ariaLive="polite" id={"terms-error"} withoutMarginBottom>
          {errorMessage}
        </FieldError>
      </Box>
    )}
    <Box
      $position={"relative"}
      $background={"grey30"}
      $pv={8}
      $ph={8}
      $mb={24}
      data-testid="termsCheckbox"
    >
      <BrushBorders hideOnMobileH hideOnMobileV color={"grey30"} />
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
  </>
);

export default ResourcePageTermsAndConditionsCheckbox;
