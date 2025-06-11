import React, { useEffect } from "react";
import {
  NextPage,
  GetStaticProps,
  GetStaticPropsResult,
  GetStaticPathsResult,
} from "next";
import { useUser } from "@clerk/nextjs";
import {
  OakGrid,
  OakGridArea,
  OakThemeProvider,
  oakDefaultTheme,
  OakMaxWidth,
  OakInlineRegistrationBanner,
  OakHeading,
  OakLink,
  OakSpan,
} from "@oaknational/oak-components";

import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import LessonList from "@/components/TeacherComponents/LessonList";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonListingPageData } from "@/node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import HeaderListing from "@/components/TeacherComponents/HeaderListing";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { LessonListItemProps } from "@/components/TeacherComponents/LessonListItem";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { NEW_COHORT } from "@/config/cohort";
import { SpecialistLesson } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";
import removeLegacySlugSuffix from "@/utils/slugModifiers/removeLegacySlugSuffix";
import isSlugEYFS from "@/utils/slugModifiers/isSlugEYFS";
import PaginationHead from "@/components/SharedComponents/Pagination/PaginationHead";
import { isLessonListItem } from "@/components/TeacherComponents/LessonListItem/LessonListItem";
import { useShareExperiment } from "@/pages-helpers/teacher/share-experiments/useShareExperiment";
import { TeacherShareButton } from "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton";
import { ExpiringBanner } from "@/components/SharedComponents/ExpiringBanner";
import { CurriculumTrackingProps } from "@/pages-helpers/teacher/share-experiments/shareExperimentTypes";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import { resolveOakHref } from "@/common-lib/urls";
import { useTeacherShareButton } from "@/components/TeacherComponents/TeacherShareButton/useTeacherShareButton";
import { useSaveUnits } from "@/node-lib/educator-api/helpers/saveUnits/useSaveUnits";
import SavingSignedOutModal from "@/components/TeacherComponents/SavingSignedOutModal";

export type LessonListingPageProps = {
  curriculumData: LessonListingPageData;
};

/**
 * This function takes a unit and returns an array of lessons with the unit data
 * embedded in each lesson.
 *
 * We do this so that we don't have to send duplicate unit data for each lesson.
 * This data gets stored in the browser and is used to render the lesson list,
 * so it's important to keep it as small as possible.
 */
function getHydratedLessonsFromUnit(unit: LessonListingPageData) {
  const { lessons, ...rest } = unit;
  return lessons.map((lesson) => {
    if (lesson.isUnpublished) {
      return lesson;
    } else {
      return {
        ...lesson,
        ...rest,
      };
    }
  });
}

const LessonListPage: NextPage<LessonListingPageProps> = ({
  curriculumData,
}) => {
  const {
    unitSlug,
    unitvariantId,
    keyStageTitle,
    keyStageSlug,
    unitTitle,
    subjectTitle,
    programmeSlug,
    subjectSlug,
    actions,
    pathwayTitle,
    tierTitle,
    examBoardTitle,
    year,
  } = curriculumData;

  const unitListingHref = `/teachers/key-stages/${keyStageSlug}/subjects/${subjectSlug}/programmes`;
  const { shareUrl, browserUrl, shareActivated } = useShareExperiment({
    programmeSlug: programmeSlug ?? undefined,
    source: "lesson-listing",
    curriculumTrackingProps: {
      lessonName: null,
      lessonSlug: null,
      unitName: unitTitle,
      unitSlug: unitSlug,
      subjectSlug,
      subjectTitle,
      keyStageSlug,
      keyStageTitle: keyStageTitle as CurriculumTrackingProps["keyStageTitle"],
      lessonReleaseCohort: isSlugLegacy(programmeSlug)
        ? "2020-2023"
        : "2023-2026",
      lessonReleaseDate: "unreleased",
    },
    overrideExistingShareId: true,
  });

  useEffect(() => {
    if (window.location.href !== browserUrl) {
      window.history.replaceState({}, "", browserUrl);
    }
  }, [browserUrl]);

  const { copiedComponent, handleClick } = useTeacherShareButton({
    shareUrl,
    shareActivated,
  });

  const teacherShareButton = (
    <TeacherShareButton
      variant="primary"
      handleClick={handleClick}
      shareUrl={shareUrl}
      label="Share"
    />
  );

  const lessons = getHydratedLessonsFromUnit(curriculumData);
  const hasNewContent = lessons.some(
    (lesson) => !lesson.isUnpublished && lesson.lessonCohort === NEW_COHORT,
  );
  const paginationProps = usePagination({
    totalResults: lessons.length,
    pageSize: RESULTS_PER_PAGE,
    items: lessons,
  });

  const {
    currentPageItems,
    paginationTitle,
    prevPageUrlObject,
    nextPageUrlObject,
    isFirstPage,
    isLastPage,
  } = paginationProps;

  const { track } = useAnalytics();

  const trackLessonSelected = ({
    ...props
  }: LessonListItemProps | SpecialistLesson) => {
    if (isLessonListItem(props)) {
      track.lessonAccessed({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        componentType: "lesson_card",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        lessonName: props.lessonTitle,
        lessonSlug: props.lessonSlug,
        unitName: unitTitle,
        unitSlug,
        keyStageSlug,
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        yearGroupName: props.yearTitle,
        yearGroupSlug: props.yearSlug,
        pathway: pathwayTitle,
        examBoard: examBoardTitle,
        tierName: tierTitle,
        lessonReleaseCohort: isSlugLegacy(programmeSlug)
          ? "2020-2023"
          : "2023-2026",
        lessonReleaseDate: props.lessonReleaseDate ?? "unreleased",
      });
    }
  };

  const isNew = hasNewContent ?? false;
  const { isSignedIn } = useUser();
  const showRiskAssessmentBanner = !!actions?.isPePractical && isSignedIn;

  const unpublishedLessonCount = lessons.filter(
    (lesson) => lesson.isUnpublished,
  ).length;

  const lessonCountHeader = unpublishedLessonCount
    ? `${lessons.length - unpublishedLessonCount}/${lessons.length} lessons available`
    : `Lessons (${lessons.length})`;

  const newsletterFormProps = useNewsletterForm();

  const getSlugifiedTitle = (title: string) => {
    return title
      .replaceAll(/\s+/g, "-")
      .replaceAll(/[^\dA-Za-z-]/g, "")
      .replaceAll(/-+/g, "-")
      .toLowerCase();
  };

  const { onSaveToggle, isUnitSaved, showSignIn, setShowSignIn } = useSaveUnits(
    programmeSlug,
    {
      savedFrom: "lesson_listing_save_button",
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      keyStageSlug,
      subjectTitle,
      subjectSlug,
    },
  );
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `${unitTitle} ${keyStageSlug.toUpperCase()} | Y${year} ${subjectTitle} Lesson Resources${paginationTitle}`,
          description: `Free lessons and teaching resources about ${unitTitle.toLowerCase()}`,
        }),
      }}
      $background="white"
    >
      <PaginationHead
        prevPageUrlObject={prevPageUrlObject}
        nextPageUrlObject={nextPageUrlObject}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
      <OakThemeProvider theme={oakDefaultTheme}>
        <HeaderListing
          breadcrumbs={[
            {
              oakLinkProps: {
                page: "home",
              },
              label: "Home",
            },
            {
              oakLinkProps: {
                page: "subject-index",
                keyStageSlug,
              },
              label: keyStageTitle,
            },
            {
              oakLinkProps: {
                page: "unit-index",
                programmeSlug:
                  subjectSlug === "maths" && !isSlugEYFS(programmeSlug)
                    ? removeLegacySlugSuffix(programmeSlug)
                    : programmeSlug,
              },
              label: subjectTitle,
            },

            {
              oakLinkProps: {
                page: "lesson-index",
                unitSlug,
                programmeSlug: programmeSlug,
              },

              label: unitTitle,
              disabled: true,
            },
          ]}
          background={"pink30"}
          subjectIconBackgroundColor={"pink"}
          title={unitTitle}
          programmeFactor={keyStageTitle} // this should be changed to year LESQ-242
          isNew={isNew}
          hasCurriculumDownload={isSlugLegacy(programmeSlug)}
          {...curriculumData}
          shareButton={teacherShareButton}
          copiedComponent={copiedComponent}
          unitDownloadFileId={`${getSlugifiedTitle(unitTitle)}-${unitvariantId}`}
          onUnitDownloadSuccess={() =>
            track.unitDownloadInitiated({
              platform: "owa",
              product: "teacher lesson resources",
              engagementIntent: "use",
              componentType: "unit_download_button",
              eventVersion: "2.0.0",
              analyticsUseCase: "Teacher",
              unitName: unitTitle,
              unitSlug,
              keyStageSlug,
              keyStageTitle: keyStageTitle as KeyStageTitleValueType,
              subjectSlug,
              subjectTitle,
            })
          }
          showRiskAssessmentBanner={showRiskAssessmentBanner}
          isIncompleteUnit={unpublishedLessonCount > 0}
          isUnitSaved={isUnitSaved(unitSlug)}
          onSave={
            isSlugLegacy(programmeSlug)
              ? undefined
              : () => onSaveToggle(unitSlug)
          }
        />
        <OakMaxWidth $ph={"inner-padding-m"}>
          <OakGrid>
            <OakGridArea
              $colSpan={[12, 9]}
              $mt={["space-between-s", "space-between-m2"]}
            >
              {unpublishedLessonCount > 0 && (
                <OakInlineRegistrationBanner
                  onSubmit={(email) => {
                    const emailPattern =
                      /^[A-Z0-9._%+-]{1,64}@[A-Z0-9-]+(?:\.[A-Z0-9-]+){0,2}\.[A-Z]{2,64}$/i;
                    const isValidEmail = emailPattern.test(email);
                    if (!isValidEmail) {
                      throw new Error("Please enter a valid email address");
                    }
                    return newsletterFormProps.onSubmit({
                      email,
                      userRole: "Teacher",
                    });
                  }}
                  bodyText={
                    <OakSpan $font="body-1">
                      We’re busy creating the final lessons. We’ll let you know
                      when the rest of this unit is ready - and send you other
                      helpful content and resources. Unsubscribe at any time.
                      Read our{" "}
                      <OakLink
                        href={resolveOakHref({
                          page: "legal",
                          legalSlug: "privacy-policy",
                        })}
                      >
                        privacy policy
                      </OakLink>
                      .
                    </OakSpan>
                  }
                  headerText={
                    <OakHeading
                      tag="h2"
                      $font={["heading-5", "heading-4", "heading-4"]}
                    >
                      Full unit on the way!
                    </OakHeading>
                  }
                />
              )}
              <LessonList
                {...curriculumData}
                lessonCount={lessons.length}
                lessonCountHeader={lessonCountHeader}
                currentPageItems={currentPageItems}
                paginationProps={paginationProps}
                headingTag={"h2"}
                unitTitle={unitTitle}
                onClick={trackLessonSelected}
                expiringBanner={
                  <ExpiringBanner
                    isOpen={actions?.displayExpiringBanner ?? false}
                    isResourcesMessage={true}
                    onwardHref={unitListingHref}
                  />
                }
              />
            </OakGridArea>
          </OakGrid>
        </OakMaxWidth>
        {showSignIn && (
          <SavingSignedOutModal
            isOpen={showSignIn}
            onClose={() => {
              setShowSignIn(false);
            }}
          />
        )}
      </OakThemeProvider>
    </AppLayout>
  );
};

export type URLParams = {
  programmeSlug: string;
  unitSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  LessonListingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "lesson-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("no context.params");
      }
      const { programmeSlug, unitSlug } = context.params;
      if (!programmeSlug || !unitSlug) {
        throw new Error("unexpected context.params");
      }

      const curriculumData = await curriculumApi2023.lessonListing({
        programmeSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonListingPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default LessonListPage;
