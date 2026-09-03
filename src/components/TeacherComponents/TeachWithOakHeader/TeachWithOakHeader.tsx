import {
  OakTertiaryInvertedButton,
  OakFlex,
  parseSpacing,
  parseBorder,
  parseColor,
} from "@oaknational/oak-components";
import styled from "styled-components";

import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

const HeaderLayout = styled(OakFlex)`
  display: flex;
  flex-direction: row;
`;

const StyledAboutSharedHeaderImage = styled(AboutSharedHeaderImage)`
  width: ${parseSpacing("100%")};

  img {
    position: relative !important;
    width: ${parseSpacing("100%")} !important;
    height: auto !important;
    border: ${parseBorder("border-solid-xxl")} ${parseColor("border-primary")};
  }
`;

type TeachWithOakHeaderProps = {
  href: string;
};

export function TeachWithOakHeader({
  href,
}: Readonly<TeachWithOakHeaderProps>) {
  const imageUrl = getCloudinaryImageUrl(
    "v1734018546/OWA/illustrations/hero-aila_wgpmas.jpg",
  );
  return (
    <>
      <NewGutterMaxWidth>
        <OakTertiaryInvertedButton
          element="a"
          href={href}
          iconName="arrow-left"
        >
          Back to lesson
        </OakTertiaryInvertedButton>
      </NewGutterMaxWidth>
      <HeaderLayout>
        <AboutSharedHeader
          title={"The thinking behind Oak lessons"}
          content={
            "See how our lessons are designed to support learning - and make the most of them in your classroom."
          }
          titleHighlight={"bg-decorative2-main"}
          showImageOverflow={true}
        >
          <StyledAboutSharedHeaderImage
            imageUrl={imageUrl}
            imageAlt={"Teach with Oak Image"}
          />
        </AboutSharedHeader>
      </HeaderLayout>
    </>
  );
}
