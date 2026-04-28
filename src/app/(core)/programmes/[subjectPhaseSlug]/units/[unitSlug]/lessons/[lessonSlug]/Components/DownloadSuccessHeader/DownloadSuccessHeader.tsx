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

const DOWNLOAD_SUCCESS_IMG_URL =
  "https://res.cloudinary.com/oak-web-application/image/upload/v1777386544/svg-illustrations/download-confirmation-Illustration_z1sczk.svg";

export function DownloadSuccessHeader({ href }: { href: string }) {
  return (
    <Header
      layoutVariant="large"
      useSubduedBackground
      headerSlot={<BackLink href={href} />}
      heading="Thank you for downloading!"
      summary={
        <OakFlex $flexDirection="column" $gap={"spacing-24"}>
          <OakP $font={"body-2"}>
            We hope you find the resources useful. Click the question mark in
            the bottom-right corner to share your feedback.{" "}
          </OakP>
          <InstallFontsInstructions />
        </OakFlex>
      }
      backgroundColorLevel={1}
      heroImage={DOWNLOAD_SUCCESS_IMG_URL}
    />
  );
}

function InstallFontsInstructions() {
  return (
    <OakFlex $gap="spacing-8" $alignItems={"center"}>
      <OakIcon iconWidth="spacing-20" iconName="info" />
      <OakP $font={"body-3"}>
        <OakSpan>Our resources work best if you </OakSpan>
        <OakLink
          href={
            "https://support.thenational.academy/how-to-install-the-google-fonts-lexend-and-kalan"
          }
          target={"_blank"}
          aria-label={
            "install the Google Fonts 'Lexend' and 'Kalam' (opens in a new tab)"
          }
        >
          install the Google Fonts ‘Lexend’ and ‘Kalam’
        </OakLink>
        <OakSpan>
          . Click the question mark in the bottom-right of the page if you need
          extra help with this.
        </OakSpan>
      </OakP>
    </OakFlex>
  );
}

function BackLink({ href }: Readonly<{ href: string }>) {
  return (
    <OakBox>
      <OakTertiaryInvertedButton
        element={Link}
        href={href}
        aria-label={"Back to lesson"}
        iconName={"arrow-left"}
        isTrailingIcon={false}
      >
        Back to lesson
      </OakTertiaryInvertedButton>
    </OakBox>
  );
}
