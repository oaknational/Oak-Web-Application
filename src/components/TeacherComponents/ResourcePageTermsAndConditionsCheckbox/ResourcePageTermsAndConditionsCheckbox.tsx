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
      <OakBox $mb="spacing-16">
        <FieldError ariaLive="polite" id={"terms-error"} withoutMarginBottom>
          {errorMessage}
        </FieldError>
      </OakBox>
    )}
    <OakBox
      $position={"relative"}
      $background={"bg-neutral-stronger"}
      $pv="spacing-8"
      $ph="spacing-8"
      $mb="spacing-24"
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
    </OakBox>
  </>
);

export default ResourcePageTermsAndConditionsCheckbox;
