import { FC, useId } from "react";
import {
  OakFlex,
  OakFlexProps,
  OakIconName,
  OakTertiaryInvertedButton,
} from "@oaknational/oak-components";
import styled from "styled-components";

export const OAK_SOCIALS: Record<SocialNetwork, string> = {
  instagram: "oaknational",
  facebook: "oaknationalacademy",
  x: "oaknational",
  linkedIn: "https://www.linkedin.com/company/oak-national-academy",
};

const getSocialUrl = (network: SocialNetwork, usernameOrUrl: string) => {
  switch (network) {
    case "instagram":
      return `https://instagram.com/${usernameOrUrl}`;
    case "facebook":
      return `https://facebook.com/${usernameOrUrl}`;
    case "linkedIn":
      return usernameOrUrl;
  }
};

const SOCIAL_NETWORKS = ["instagram", "facebook", "x", "linkedIn"] as const;
type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];
type SocialButtonConfig = {
  label: string;
  icon: OakIconName;
};
const SOCIAL_BUTTON_CONFIGS: Record<SocialNetwork, SocialButtonConfig> = {
  instagram: {
    label: "instagram",
    icon: "instagram",
  },
  facebook: {
    label: "facebook",
    icon: "facebook",
  },
  x: {
    label: "x",
    icon: "x",
  },
  linkedIn: {
    label: "linkedIn",
    icon: "linkedin",
  },
} as const;

type SocialUrls = Partial<Record<SocialNetwork, string | null | undefined>>;

type SocialButtonsProps = OakFlexProps &
  SocialUrls & {
    /**
     * for: who's social media accounts are being linekd
     * @example Oak National Academy
     * @example Joan Baez
     */
    for: string;
  };

const StyledIconButton = styled(OakTertiaryInvertedButton)`
  .icon-container > *:first-child {
    border: 0;
  }
`;

const SocialButtons: FC<SocialButtonsProps> = (props) => {
  const { for: accountHolder, ...flexProps } = props;
  const id = useId();
  const socialsToShow = SOCIAL_NETWORKS.filter((network) => props[network]);

  if (socialsToShow.length === 0) {
    return null;
  }

  return (
    <OakFlex
      $alignItems={"center"}
      $justifyContent={"center"}
      $gap={"spacing-16"}
      {...flexProps}
    >
      {socialsToShow.map((network) => {
        const { label, icon } = SOCIAL_BUTTON_CONFIGS[network];
        const profile = props[network];
        if (!profile) {
          return null;
        }
        const href = getSocialUrl(network, profile);
        if (!href) {
          return null;
        }
        return (
          <StyledIconButton
            iconName={icon}
            element="a"
            href={href}
            key={`SocialButtons-${id}-${network}`}
            aria-label={`${label} for ${accountHolder}`}
          />
        );
      })}
    </OakFlex>
  );
};

export default SocialButtons;
