import {
  oakAllSpacingTokens,
  oakDropShadowTokens,
  oakDefaultTheme,
  OakColorFilterToken,
  OakIcon,
} from "@oaknational/oak-components";
import { capitalize } from "lodash";
import styled from "styled-components";

const StyledSocialLink = styled.a`
  margin: auto;
  padding: ${oakAllSpacingTokens["spacing-0"]};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${oakAllSpacingTokens["spacing-4"]}px;
  background: ${oakDefaultTheme.uiColors["bg-btn-secondary"]};
  height: ${oakAllSpacingTokens["spacing-32"]}px;
  width: ${oakAllSpacingTokens["spacing-32"]}px;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;

  :focus {
    /* drop-shadow-focus */
    outline: none;
    box-shadow: ${oakDropShadowTokens["drop-shadow-centered-lemon"]},
      ${oakDropShadowTokens["drop-shadow-centered-grey"]};
  }

  :hover {
    /* drop-shadow-lemon */
    box-shadow: ${oakDropShadowTokens["drop-shadow-centered-lemon"]};
  }

  :active {
    /* drop-shadow-pressed */
    box-shadow: ${oakDropShadowTokens["drop-shadow-centered-lemon"]},
      ${oakDropShadowTokens["drop-shadow-centered-grey"]};
  }
`;
type SocialMediaTypes = "linkedin" | "facebook" | "x" | "instagram";
const getAriaLabel = (socialSlug: SocialMediaTypes) => {
  if (socialSlug === "linkedin") {
    return "LinkedIn";
  }
  return capitalize(socialSlug);
};

type SocialButtonProps = {
  socialType: SocialMediaTypes;
  profileHref: string;
  disabled?: boolean;
  background?: OakColorFilterToken;
};

export function SocialButton({
  socialType,
  profileHref,
  disabled,
  background,
}: Readonly<SocialButtonProps>) {
  // disable the link by removing href & manually removing pointer events & styling
  const props = disabled
    ? { style: { pointerEvents: undefined, boxShadow: "none", border: "none" } }
    : { href: profileHref };

  return (
    <StyledSocialLink
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      role="link"
      aria-disabled={disabled}
    >
      <OakIcon
        iconName={socialType}
        $height={"spacing-20"}
        $colorFilter={
          disabled ? "icon-disabled" : (background ?? "transparent")
        }
        alt={getAriaLabel(socialType)}
      />
    </StyledSocialLink>
  );
}
