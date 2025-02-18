import { FC } from "react";
import { OakBox } from "@oaknational/oak-components";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import Checkbox from "@/components/SharedComponents/Checkbox";
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
      <OakBox $mb="space-between-s">
        <FieldError ariaLive="polite" id={"terms-error"} withoutMarginBottom>
          {errorMessage}
        </FieldError>
      </OakBox>
    )}
    <OakBox
      $position={"relative"}
      $background={"grey30"}
      $pv="inner-padding-xs"
      $ph="inner-padding-xs"
      $mb="space-between-m"
      data-testid="termsCheckbox"
    >
      <BrushBorders hideOnMobileH hideOnMobileV color={"grey30"} />
      <Checkbox
        label={"I accept terms and conditions (required)"}
        checked={checked}
        onChange={onChange}
        $mb={0}
        required
        error={errorMessage}
        hasError={Boolean(errorMessage)}
        variant="withLabel"
        {...props}
      />
    </OakBox>
  </>
);

export default ResourcePageTermsAndConditionsCheckbox;
