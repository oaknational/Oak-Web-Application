import {
  OakCheckBox,
  OakFieldError,
  OakFlex,
} from "@oaknational/oak-components";

import Terms from "../Terms";

import Box from "@/components/SharedComponents/Box";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";

/*
 * Waiting for the following components to be in oak-components
 *
 *  - <Box />
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
}: AcceptTermsProps) {
  return (
    <OakFlex
      $width={"100%"}
      $flexDirection={"column"}
      $alignItems={"start"}
      $gap={"space-between-m"}
    >
      {error && (
        <div data-testid="error">
          <OakFieldError>{error}</OakFieldError>
        </div>
      )}
      <Box $position={"relative"} $background={"grey20"} $pv={6} $ph={6}>
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
      </Box>

      <Terms />
    </OakFlex>
  );
}
