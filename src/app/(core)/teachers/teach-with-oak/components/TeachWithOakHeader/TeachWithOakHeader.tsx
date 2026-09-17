import {
  OakTertiaryInvertedButton,
  OakFlex,
  parseSpacing,
  parseBorder,
  parseColor,
  OakBox,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { useReturnToLessonProps } from "../../getReturnToLessonLink";

import { extractLessonAccessedPropsFromHref } from "./extractLessonAccessedPropsFromHref";

import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

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

export function TeachWithOakHeader() {
  const imageUrl = getCloudinaryImageUrl(
    "v1734018546/OWA/illustrations/hero-aila_wgpmas.jpg",
  );

  const { lessonAccessed } = useTeacherBrowseAnalytics((store) => store.track);

  const returnToLessonProps = useReturnToLessonProps();

  return (
    <OakBox
      $mt={["spacing-56", "spacing-80", "spacing-56"]}
      $mb={["spacing-56", "spacing-80", "spacing-72"]}
    >
      {returnToLessonProps && (
        <NewGutterMaxWidth>
          <OakTertiaryInvertedButton
            element="a"
            href={returnToLessonProps.returnTo}
            iconName="arrow-left"
            onClick={() => {
              const lessonAccessedProps =
                extractLessonAccessedPropsFromHref(returnToLessonProps);
              if (lessonAccessedProps) {
                lessonAccessed(lessonAccessedProps);
              }
            }}
          >
            Back to lesson
          </OakTertiaryInvertedButton>
        </NewGutterMaxWidth>
      )}
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
    </OakBox>
  );
}
