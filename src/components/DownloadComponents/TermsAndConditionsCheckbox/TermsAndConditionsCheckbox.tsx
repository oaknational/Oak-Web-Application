import { FC } from "react";
import styled from "styled-components";

import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import P from "@/components/Typography/P";
import Checkbox from "@/components/Checkbox";
import Box from "@/components/Box";
import OakLink from "@/components/OakLink";
import FieldError from "@/components/FormFields/FieldError";
import { CheckboxProps } from "@/components/Checkbox/Checkbox";

export type TermsAndConditionsCheckboxProps = CheckboxProps & {
  errorMessage?: string;
  showPostAlbCopyright: boolean;
};

const PreAlbCopyright = () => (
  <P $font="body-3">
    This content is made available by Oak and its partners and licensed under
    Oak’s{" "}
    <OakLink page={"legal"} legalSlug="terms-and-conditions" $isInline>
      terms &amp; conditions
    </OakLink>
    , except where otherwise stated.
  </P>
);

const StyledLink = styled.a`
  display: inline;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.hyperlink};
`;

const PostAlbCopyright = () => (
  <P $font="body-3">
    This content is © Oak National Academy (2023), licensed on{" "}
    <StyledLink
      aria-label={"Open Government License version 3.0"}
      role="link"
      href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
    >
      Open Government Licence version 3.0
    </StyledLink>{" "}
    except where otherwise stated. See{" "}
    <OakLink page={"legal"} legalSlug="terms-and-conditions" $isInline>
      Oak's terms &amp; conditions
    </OakLink>
    .
  </P>
);

const TermsAndConditionsCheckbox: FC<TermsAndConditionsCheckboxProps> = ({
  checked,
  onChange,
  errorMessage,
  showPostAlbCopyright,
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
    {showPostAlbCopyright ? <PostAlbCopyright /> : <PreAlbCopyright />}
  </>
);

export default TermsAndConditionsCheckbox;
