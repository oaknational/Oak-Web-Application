import { ChangeEventHandler, FC, FocusEventHandler } from "react";
import { OakBox, OakCheckBox } from "@oaknational/oak-components";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import FieldError from "@/components/SharedComponents/FieldError";

export type ResourcePageTermsAndConditionsCheckboxProps = {
  id: string;
  name: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
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
      <BrushBorders hideOnMobileH hideOnMobileV color={"bg-neutral-stronger"} />
      <OakCheckBox
        value="terms-and-conditions"
        displayValue="I accept terms and conditions (required)"
        checked={checked}
        onChange={onChange}
        uncheckedBorderColor={errorMessage ? "border-error" : undefined}
        {...props}
      />
    </OakBox>
  </>
);

export default ResourcePageTermsAndConditionsCheckbox;
