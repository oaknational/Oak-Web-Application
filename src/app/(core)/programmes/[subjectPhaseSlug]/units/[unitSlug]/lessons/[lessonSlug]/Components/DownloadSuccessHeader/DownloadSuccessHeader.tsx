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
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { resolveOakHref } from "@/common-lib/urls";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

const DOWNLOAD_SUCCESS_IMG_URL =
  "v1777386544/svg-illustrations/download-confirmation-Illustration_z1sczk.svg";

type DownloadSuccessHeaderProps = {
  href?: string;
  onBackClick?: () => void;
  backgroundColorLevel?: HeaderProps["backgroundColorLevel"];
  returnTo: "lesson" | "downloads";
};

export function DownloadSuccessHeader(
  props: Readonly<DownloadSuccessHeaderProps>,
) {
  /** We only show the help message if the user has consented to the Gleap cookie */
  const { getConsent } = useOakConsent();
  const cookiesNotAccepted = getConsent(ServicePolicyMap.GLEAP) === "denied";

  return (
    <Header
      layoutVariant="large"
      useSubduedBackground
      headerSlot={<BackLinkButton {...props} />}
      heading="Thanks for downloading!"
      summary={
        <OakFlex $flexDirection="column" $gap={"spacing-24"}>
          <OakP $font={"body-2"}>
            We hope you find the resources useful. Click the question mark in
            the bottom-right corner to share your feedback.{" "}
          </OakP>
          <InstallFontsInstructions showHelpMessage={!cookiesNotAccepted} />
        </OakFlex>
      }
      backgroundColorLevel={props.backgroundColorLevel}
      heroImage={getCloudinaryImageUrl(DOWNLOAD_SUCCESS_IMG_URL)}
    />
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

function BackLinkButton(props: Readonly<DownloadSuccessHeaderProps>) {
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
