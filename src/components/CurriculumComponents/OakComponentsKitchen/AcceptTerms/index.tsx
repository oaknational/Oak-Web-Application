import {
  OakBox,
  OakCheckBox,
  OakFieldError,
  OakFlex,
} from "@oaknational/oak-components";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";

/*
 * Waiting for the following components to be in oak-components
 *
 *  - <BrushBorders />
 */
type AcceptTermsProps = {
  error?: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
};
export default function AcceptTerms({
  error,
  value,
  onChange,
}: Readonly<AcceptTermsProps>) {
  return (
    <OakFlex
      $width={"100%"}
      $flexDirection={"column"}
      $alignItems={"start"}
      $gap={"spacing-24"}
    >
      {error && (
        <div data-testid="error">
          <OakFieldError>{error}</OakFieldError>
        </div>
      )}
      <OakBox
        $position={"relative"}
        $background={"bg-neutral"}
        $pv="spacing-8"
        $ph="spacing-8"
      >
        <BrushBorders hideOnMobileH hideOnMobileV color={"grey20"} />
        <OakCheckBox
          displayValue={"I accept terms and conditions (required)"}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          value="download-accept-terms"
          id="download-accept-terms"
          data-testid="download-accept-terms"
          name={"accept-terms"}
        />
      </OakBox>
    </OakFlex>
  );
}
