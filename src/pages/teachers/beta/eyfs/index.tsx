import { NextPage } from "next";
import { notFound } from "next/navigation";
import {
  oakDefaultTheme,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakMaxWidth,
  OakP,
  OakPrimaryButton,
  OakSecondaryButton,
  OakSmallSecondaryButton,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { useState } from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { EYFSProgramme } from "@/node-lib/curriculum-api-2023/queries/eyfsListing/eyfsListing.query";
import LessonOverviewVideo from "@/components/TeacherComponents/LessonOverviewVideo";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";

type Props = { curriculumData: EYFSProgramme };
const EYFSPage: NextPage<Props> = (props: Props) => {
  const { curriculumData } = props;
  const subjects = Object.keys(curriculumData);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [videoOpen, setVideoOpen] = useState<string | null>(null);

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `EYFS`,
          description: "View eyfs lesson content",
        }),
      }}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakMaxWidth>
          <OakGrid>
            <OakGridArea $colSpan={[12, 9]} $mt={"spacing-48"}>
              <OakFlex $gap={"spacing-12"} $mb={"spacing-24"}>
                {subjects.map((s) => (
                  <OakSecondaryButton
                    key={s}
                    onClick={() => setSelectedSubject(s)}
                    iconName={selectedSubject === s ? "tick" : undefined}
                  >
                    {curriculumData[s]?.programmeFields?.subject}
                  </OakSecondaryButton>
                ))}
              </OakFlex>
              {Object.entries(curriculumData).map(([slug, programme]) => (
                <OakFlex
                  key={slug}
                  $flexDirection={"column"}
                  $gap={"spacing-12"}
                  $mb={"spacing-24"}
                  $display={selectedSubject === slug ? "flex" : "none"}
                >
                  <OakHeading tag="h2" $font={"heading-light-2"}>
                    {programme.programmeFields?.subject ?? ""}
                  </OakHeading>
                  {Object.entries(programme.units).map(([slug, unit]) => (
                    <OakFlex
                      key={slug}
                      $flexDirection={"column"}
                      $gap={"spacing-12"}
                      $mb={"spacing-16"}
                      $borderRadius={"border-radius-m"}
                      $background={"pink30"}
                      $pa={"spacing-12"}
                    >
                      <OakHeading tag="h3">{unit.unitData.title}</OakHeading>
                      {unit.lessons.map((lesson) => (
                        <OakFlex
                          $flexDirection="column"
                          key={lesson.slug}
                          $borderRadius={"border-radius-m"}
                          $background={"white"}
                          $pa={"spacing-12"}
                          $gap={"spacing-12"}
                        >
                          <OakP $font={"body-2-bold"}>{lesson.title}</OakP>

                          {lesson.description && (
                            <OakP $font={"body-3"}>{lesson.description}</OakP>
                          )}
                          <OakFlex $gap={"spacing-12"}>
                            {lesson.video.muxPlaybackId && (
                              <OakPrimaryButton
                                onClick={() =>
                                  setVideoOpen((prev) => {
                                    if (prev !== null && lesson.slug === prev) {
                                      return null;
                                    } else {
                                      return lesson.slug;
                                    }
                                  })
                                }
                              >
                                {videoOpen === lesson.slug
                                  ? "Hide video"
                                  : "Show video"}
                              </OakPrimaryButton>
                            )}
                            <OakSmallSecondaryButton
                              isTrailingIcon
                              iconName="download"
                            >
                              Download lesson
                            </OakSmallSecondaryButton>
                          </OakFlex>
                          {lesson.video.muxPlaybackId &&
                            videoOpen === lesson.slug && (
                              <LessonOverviewVideo
                                video={lesson.video.muxPlaybackId}
                                title={lesson.video.title ?? lesson.title}
                                isLegacy
                                signLanguageVideo={null}
                              />
                            )}
                        </OakFlex>
                      ))}
                    </OakFlex>
                  ))}
                </OakFlex>
              ))}
            </OakGridArea>
          </OakGrid>
        </OakMaxWidth>
      </OakThemeProvider>
    </AppLayout>
  );
};

export const getStaticProps = async () => {
  try {
    const curriculumData = await curriculumApi2023.eyfsListing();
    return {
      props: { curriculumData },
    };
  } catch {
    return {
      notFound,
    };
  }
};

export default EYFSPage;
