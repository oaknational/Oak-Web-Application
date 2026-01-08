"use client";
import { useState } from "react";

import LessonOverviewVideo from "@/components/TeacherComponents/LessonOverviewVideo";
import { EYFSProgramme } from "@/node-lib/curriculum-api-2023/queries/eyfsListing/eyfsListing.query";
import {
  OakGrid,
  OakGridArea,
  OakFlex,
  OakSecondaryButton,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakSmallSecondaryButton,
} from "@/styles/oakThemeApp";

type EYFSSubjectsViewProps = { curriculumData: EYFSProgramme };

export default function EYFSSubjectsView(props: EYFSSubjectsViewProps) {
  const { curriculumData } = props;
  const subjects = Object.keys(curriculumData);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);
  const [videoOpen, setVideoOpen] = useState<string | null>(null);

  return (
    <OakGrid $width={"100%"}>
      <OakGridArea $colSpan={[12, 8]} $mt={"spacing-48"} $colStart={[0, 3]}>
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
                          browsePathwayData={{
                            unitName: unit.unitData.title,
                            unitSlug: unit.unitData.slug,
                            keyStageSlug: "early-years-foundation-stage",
                            keyStageTitle: "Early Years Foundation stage",
                            subjectSlug:
                              programme.programmeFields?.subject_slug ?? "",
                            subjectTitle:
                              programme.programmeFields?.subject ?? "",
                            lessonSlug: lesson.slug,
                            lessonName: lesson.title,
                            pathway: null,
                            tierName: null,
                            yearGroupName: "Reception",
                            yearGroupSlug: "r",
                            examBoard: null,
                            releaseGroup: "legacy",
                            phase: "primary",
                            lessonReleaseCohort: "2020-2023",
                            lessonReleaseDate: "",
                          }}
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
  );
}
