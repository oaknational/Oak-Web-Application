import Link from "next/link";
import {
  OakBox,
  OakFlex,
  OakIcon,
  OakLink,
  OakP,
  OakSpan,
  OakTertiaryInvertedButton,
} from "@oaknational/oak-components";
import { useOakConsent } from "@oaknational/oak-consent-client";

import {
  Header,
  HeaderProps,
} from "@/components/TeacherComponents/Header/Header";
import { resolveOakHref } from "@/common-lib/urls";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

type DownloadSuccessHeaderProps = {
  href?: string;
  onBackClick?: () => void;
  backgroundColorLevel?: HeaderProps["backgroundColorLevel"];
  /** When omitted no back link is rendered */
  returnTo?: "lesson" | "downloads";
  showFontInstructions?: boolean;
  layoutVariant?: "compact" | "large";
  heroImage?: string | null;
};

export function DownloadSuccessHeader(
  props: Readonly<DownloadSuccessHeaderProps>,
) {
  const {
    returnTo,
    showFontInstructions = true,
    layoutVariant = "compact",
    heroImage = null,
  } = props;
  /** We only show the help message if the user has consented to the Gleap cookie */
  const { getConsent } = useOakConsent();
  const cookiesNotAccepted = getConsent(ServicePolicyMap.GLEAP) === "denied";

  const sharedProps: HeaderProps = {
    useSubduedBackground: true,
    headerSlot: returnTo ? (
      <BackLinkButton {...props} returnTo={returnTo} />
    ) : undefined,
    heading: "Thanks for downloading!",
    summary: (
      <OakFlex $flexDirection="column" $gap={"spacing-24"}>
        <OakP $font={"body-2"}>
          e We hope you find the resources useful. Click the question mark in
          the bottom-right corner to share your feedback.{" "}
        </OakP>
        {showFontInstructions && (
          <InstallFontsInstructions showHelpMessage={!cookiesNotAccepted} />
        )}
      </OakFlex>
    ),
    backgroundColorLevel: props.backgroundColorLevel,
  };

  // Header's props are a discriminated union, so each variant needs its own element
  return layoutVariant === "large" ? (
    <Header {...sharedProps} layoutVariant="large" heroImage={heroImage} />
  ) : (
    <Header {...sharedProps} layoutVariant="compact" />
  );
}

function InstallFontsInstructions({
  showHelpMessage,
}: Readonly<{
  showHelpMessage: boolean;
}>) {
  return (
    <OakFlex $gap="spacing-8" $alignItems={"center"}>
      <OakIcon iconWidth="spacing-20" iconName="info" />
      <OakP $font={"body-3"}>
        <OakSpan>Our resources work best if you </OakSpan>
        <OakLink
          href={resolveOakHref({ page: "help-font" })}
          target={"_blank"}
          aria-label={
            "install the Google Fonts 'Lexend' and 'Kalam' (opens in a new tab)"
          }
        >
          install the Google Fonts ‘Lexend’ and ‘Kalam’.{" "}
        </OakLink>
        {showHelpMessage && (
          <OakSpan>
            Click the question mark in the bottom-right of the page if you need
            extra help with this.
          </OakSpan>
        )}
      </OakP>
    </OakFlex>
  );
}

function BackLinkButton(
  props: Readonly<
    DownloadSuccessHeaderProps & {
      returnTo: NonNullable<DownloadSuccessHeaderProps["returnTo"]>;
    }
  >,
) {
  return (
    <OakBox>
      <OakTertiaryInvertedButton
        element={props.href ? Link : "button"}
        href={props.href ?? undefined}
        aria-label={"Back to lesson"}
        iconName={"arrow-left"}
        isTrailingIcon={false}
        onClick={props.onBackClick}
      >
        Back to {props.returnTo}
      </OakTertiaryInvertedButton>
    </OakBox>
  );
}
