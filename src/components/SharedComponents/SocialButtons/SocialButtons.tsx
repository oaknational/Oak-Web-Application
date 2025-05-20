import { FC, useId } from "react";

import { PixelSpacing } from "@/styles/theme";
import { ResponsiveValues } from "@/styles/utils/responsive";
import { ButtonSize } from "@/components/SharedComponents/Button/common";
import { IconName } from "@/components/SharedComponents/Icon.deprecated";
import IconButtonAsLink from "@/components/SharedComponents/Button/IconButtonAsLink";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

export const OAK_SOCIALS: Record<SocialNetwork, string> = {
  instagram: "oaknational",
  facebook: "oaknationalacademy",
  twitter: "oaknational",
  linkedIn: "https://www.linkedin.com/company/oak-national-academy",
};

const getSocialUrl = (network: SocialNetwork, usernameOrUrl: string) => {
  switch (network) {
    case "instagram":
      return `https://instagram.com/${usernameOrUrl}`;
    case "facebook":
      return `https://facebook.com/${usernameOrUrl}`;
    case "twitter":
      return `https://twitter.com/${usernameOrUrl}`;
    case "linkedIn":
      return usernameOrUrl;
  }
};

const SOCIAL_NETWORKS = [
  "instagram",
  "facebook",
  "twitter",
  "linkedIn",
] as const;
type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];
type SocialButtonConfig = {
  label: string;
  icon: IconName;
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
  twitter: {
    label: "twitter",
    icon: "twitter",
  },
  linkedIn: {
    label: "linkedIn",
    icon: "linkedin",
  },
} as const;

type SocialUrls = Partial<Record<SocialNetwork, string | null | undefined>>;

type SocialButtonsProps = FlexProps &
  SocialUrls & {
    /**
     * for: who's social media accounts are being linekd
     * @example Oak National Academy
     * @example Joan Baez
     */
    for: string;
    size?: ButtonSize;
    spaceBetween?: ResponsiveValues<PixelSpacing>;
  };
const SocialButtons: FC<SocialButtonsProps> = (props) => {
  props = {
    size: "large",
    spaceBetween: 16,
    ...props,
  };
  const { size, spaceBetween, for: accountHolder, ...flexProps } = props;
  const id = useId();
  const socialsToShow = SOCIAL_NETWORKS.filter((network) => props[network]);

  if (socialsToShow.length === 0) {
    return null;
  }

  return (
    <Flex $alignItems={"center"} $justifyContent={"center"} {...flexProps}>
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
          <IconButtonAsLink
            key={`SocialButtons-${id}-${network}`}
            aria-label={`${label} for ${accountHolder}`}
            icon={icon}
            href={href}
            page={null}
            variant={"minimal"}
            $mr={spaceBetween}
            size={size}
          />
        );
      })}
    </Flex>
  );
};

export default SocialButtons;
