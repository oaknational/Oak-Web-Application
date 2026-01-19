import {
  oakAllSpacingTokens,
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
  background: var(--Tokens-Background-bg-btn-secondary, #fff);
  height: ${oakAllSpacingTokens["spacing-32"]}px;
  width: ${oakAllSpacingTokens["spacing-32"]}px;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;

  :focus {
    /* drop-shadow-focus */
    outline: none;
    box-shadow:
      0 0 0 2px #ffe555,
      0 0 0 5px #575757;
  }

  :hover {
    /* drop-shadow-lemon */
    box-shadow: 2px 2px 0 0 #ffe555;
  }

  :active {
    /* drop-shadow-pressed */
    box-shadow:
      2px 2px 0 0 #ffe555,
      4px 4px 0 0 #575757;
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
