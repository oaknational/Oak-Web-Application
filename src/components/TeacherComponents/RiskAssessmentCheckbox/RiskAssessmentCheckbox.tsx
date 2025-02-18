import { FC } from "react";
import { OakBox, OakP, OakLink } from "@oaknational/oak-components";
import Link from "next/link";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import Checkbox from "@/components/SharedComponents/Checkbox";
import FieldError from "@/components/SharedComponents/FieldError";
import { CheckboxProps } from "@/components/SharedComponents/Checkbox/Checkbox";

export type RiskAssessmentCheckboxProps = CheckboxProps & {
  errorMessage?: string;
};

const RiskAssessmentCheckboxLabel = () => (
  <OakP>
    I understand that a{" "}
    <OakLink
      element={Link}
      href={
        "https://www.thenational.academy/legal/physical-activity-disclaimer"
      }
      target="_blank"
      iconName="external"
      isTrailingIcon
      iconWidth="all-spacing-5"
      iconHeight="all-spacing-5"
    >
      risk assessment
    </OakLink>{" "}
    should be carried out before undertaking this lesson (required)
  </OakP>
);
const RiskAssessmentCheckbox: FC<RiskAssessmentCheckboxProps> = ({
  checked,
  onChange,
  errorMessage,
  ...props
}) => (
  <>
    {errorMessage && (
      <OakBox $mb="space-between-s">
        <FieldError
          ariaLive="polite"
          id={"risk-assessment-error"}
          withoutMarginBottom
        >
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
      data-testid="riskAssessmentCheckbox"
    >
      <BrushBorders hideOnMobileH hideOnMobileV color={"grey30"} />
      <Checkbox
        label={<RiskAssessmentCheckboxLabel />}
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
    <OakBox>
      <OakP $font="body-3">
        Further support can be found in the Association for Physical Education
        (afPE) resource{" "}
        <OakLink
          element={Link}
          href={"https://www.afpe.org.uk/page/Safe_Practice_in_PESSPA#"}
          target="_blank"
          iconName="external"
          iconWidth="all-spacing-5"
          iconHeight="all-spacing-5"
          isTrailingIcon
        >
          'Safe Practice: in PESSPA’
        </OakLink>
        .
      </OakP>
    </OakBox>
  </>
);

export default RiskAssessmentCheckbox;
