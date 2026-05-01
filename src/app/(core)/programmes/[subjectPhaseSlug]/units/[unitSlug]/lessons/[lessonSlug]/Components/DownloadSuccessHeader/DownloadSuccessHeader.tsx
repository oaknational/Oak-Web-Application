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

import { Header } from "@/components/TeacherComponents/Header/Header";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { resolveOakHref } from "@/common-lib/urls";

const DOWNLOAD_SUCCESS_IMG_URL =
  "v1777386544/svg-illustrations/download-confirmation-Illustration_z1sczk.svg";

type DownloadSuccessHeaderProps = {
  href: string;
  onBackClick?: () => void;
  showHelpMessage?: boolean;
  backLinkTestId?: string;
};

export function DownloadSuccessHeader({
  href,
  onBackClick,
  showHelpMessage = true,
  backLinkTestId,
}: Readonly<DownloadSuccessHeaderProps>) {
  return (
    <Header
      layoutVariant="large"
      useSubduedBackground
      headerSlot={
        <BackLink
          href={href}
          onBackClick={onBackClick}
          testId={backLinkTestId}
        />
      }
      heading="Thanks for downloading!"
      summary={
        <OakFlex $flexDirection="column" $gap={"spacing-24"}>
          <OakP $font={"body-2"}>
            We hope you find the resources useful. Click the question mark in
            the bottom-right corner to share your feedback.{" "}
          </OakP>
          <InstallFontsInstructions showHelpMessage={showHelpMessage} />
        </OakFlex>
      }
      backgroundColorLevel={1}
      heroImage={getCloudinaryImageUrl(DOWNLOAD_SUCCESS_IMG_URL)}
    />
  );
}

function InstallFontsInstructions({
  showHelpMessage,
}: Readonly<{ showHelpMessage: boolean }>) {
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
          install the Google Fonts ‘Lexend’ and ‘Kalam’
        </OakLink>
        {showHelpMessage ? (
          <OakSpan>
            . Click the question mark in the bottom-right of the page if you
            need extra help with this.
          </OakSpan>
        ) : (
          <OakSpan>.</OakSpan>
        )}
      </OakP>
    </OakFlex>
  );
}

function BackLink({
  href,
  onBackClick,
  testId,
}: Readonly<{ href: string; onBackClick?: () => void; testId?: string }>) {
  return (
    <OakBox>
      <OakTertiaryInvertedButton
        element={Link}
        href={href}
        aria-label={"Back to lesson"}
        iconName={"arrow-left"}
        isTrailingIcon={false}
        data-testid={testId}
        onClick={onBackClick}
      >
        Back to lesson
      </OakTertiaryInvertedButton>
    </OakBox>
  );
}
