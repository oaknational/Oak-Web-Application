import {
  OakTertiaryInvertedButton,
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

const HeaderLayout = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${parseSpacing("spacing-16")};
`;

const StyledAboutSharedHeaderImage = styled(AboutSharedHeaderImage)`
  border: ${parseBorder("border-solid-xxl")} ${parseColor("border-primary")};
`;

type TeachWithOakHeaderProps = {
  href: string;
};

export function TeachWithOakHeader({
  href,
}: Readonly<TeachWithOakHeaderProps>) {
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
        >
          <StyledAboutSharedHeaderImage
            imageUrl={
              "https://sanity-asset-cdn.thenational.academy/images/cuvjke51/production/b81ee19a35baa3192360a210fda34cc9b21f4fd6-5824x3264.jpg"
            }
            imageAlt={"Teach with Oak Image"}
          />
        </AboutSharedHeader>
      </HeaderLayout>
    </>
  );
}
