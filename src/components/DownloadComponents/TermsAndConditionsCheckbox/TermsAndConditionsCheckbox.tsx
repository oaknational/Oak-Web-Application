import { FC } from "react";

import BrushBorders from "../../SpriteSheet/BrushSvgs/BrushBorders";
import P from "../../Typography/P";
import Checkbox from "../../Checkbox";
import Box from "../../Box";
import OakLink from "../../OakLink";
import FieldError from "../../FormFields/FieldError";
import { CheckboxProps } from "../../Checkbox/Checkbox";

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
      $background={"pastelTurquoise"}
      $pv={8}
      $ph={8}
      $mb={24}
      data-testid="termsCheckbox"
    >
      <BrushBorders hideOnMobileH hideOnMobileV color={"pastelTurquoise"} />
      <Checkbox
        labelText={"I accept terms and conditions (required)"}
        checked={checked}
        onChange={onChange}
        $mb={0}
        required
        error={errorMessage}
        hasError={Boolean(errorMessage)}
        variant="terms"
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
    <P $font="body-3">
      Read our{" "}
      <OakLink page={"legal"} slug="terms-and-conditions" $isInline>
        terms &amp; conditions
      </OakLink>
      .
    </P>
  </>
);

export default TermsAndConditionsCheckbox;
