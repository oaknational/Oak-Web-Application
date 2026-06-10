import { ChangeEventHandler, FC, FocusEventHandler } from "react";
import {
  OakBox,
  OakCheckBox,
  OakLink,
  OakLabel,
  OakFlex,
} from "@oaknational/oak-components";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import FieldError from "@/components/SharedComponents/FieldError";
import { SHARE_FORM_ERROR_IDS } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/shareDownloadFormErrorIds";
import { resolveOakHref } from "@/common-lib/urls/urls";

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
        <FieldError
          ariaLive="polite"
          id={SHARE_FORM_ERROR_IDS.terms}
          withoutMarginBottom
        >
          {errorMessage}
        </FieldError>
      </OakBox>
    )}
    <OakFlex
      $position={"relative"}
      $background={"bg-neutral-stronger"}
      $pv="spacing-8"
      $ph="spacing-8"
      $mb="spacing-24"
      data-testid="termsCheckbox"
      $gap={"spacing-12"}
    >
      <BrushBorders hideOnMobileH hideOnMobileV color={"bg-neutral-stronger"} />
      <OakCheckBox
        value="terms-and-conditions"
        displayValue={""}
        checked={checked}
        onChange={onChange}
        uncheckedBorderColor={errorMessage ? "border-error" : undefined}
        data-testid="termsCheckboxInput"
        aria-describedby={errorMessage ? SHARE_FORM_ERROR_IDS.terms : undefined}
        {...props}
        // OakCheckBox forwards required to the native input but omits it from types.
        // @ts-expect-error required is valid on checkbox inputs
        required
      />
      <OakLabel htmlFor={props.id} data-testid="termsCheckboxLabel">
        I accept the{" "}
        <OakLink
          href={resolveOakHref({
            page: "legal",
            legalSlug: "terms-and-conditions",
          })}
          target={"_blank"}
          aria-label="Oak's terms & conditions (opens in a new tab)"
          iconName="external"
          isTrailingIcon
          iconHeight="spacing-20"
          iconWidth="spacing-20"
          data-testid="external-link-icon"
        >
          Oak's terms & conditions
        </OakLink>{" "}
        (required)
      </OakLabel>
    </OakFlex>
  </>
);

export default ResourcePageTermsAndConditionsCheckbox;
