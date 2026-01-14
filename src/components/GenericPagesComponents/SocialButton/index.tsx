import { OakColorFilterToken, OakIcon } from "@oaknational/oak-components";
import { capitalize } from "lodash";
import styled from "styled-components";

const StyledSocialButton = styled.button`
  margin: auto;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--Border-Radius-border-radius-s, 4px);
  background: var(--Tokens-Background-bg-btn-secondary, #fff);
  height: 32px;
  width: 32px;

  :hover {
    /* drop-shadow-lemon */
    box-shadow: 2px 2px 0 0 #ffe555;
  }

  :focus {
    /* drop-shadow-focus */
    box-shadow:
      0 0 0 2px #ffe555,
      0 0 0 5px #575757;
  }

  :active {
    /* drop-shadow-pressed */
    box-shadow:
      2px 2px 0 0 #ffe555,
      4px 4px 0 0 #575757;
  }

  :disabled {
    pointer-events: none;
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
  return (
    <StyledSocialButton
      aria-label={getAriaLabel(socialType)}
      disabled={disabled}
    >
      <a href={profileHref} target="_blank" rel="noopener noreferrer">
        <OakIcon
          iconName={socialType}
          $height={"spacing-20"}
          $colorFilter={
            disabled ? "icon-disabled" : (background ?? "transparent")
          }
        />
      </a>
    </StyledSocialButton>
  );
}
