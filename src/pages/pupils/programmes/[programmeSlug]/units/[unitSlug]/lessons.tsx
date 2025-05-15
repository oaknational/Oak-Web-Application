import { GetStaticProps, GetStaticPropsResult } from "next";
import { useEffect, useState } from "react";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import { PupilViewsLessonListing } from "@/components/PupilViews/PupilLessonListing/PupilLessonListing.view";
import { resolveOakHref } from "@/common-lib/urls";
import { validateProgrammeSlug } from "@/utils/validateProgrammeSlug";

type PupilLessonListingURLParams = {
  programmeSlug: string;
  unitSlug: string;
};

export type PupilLessonListingBackLink = {
  programmeSlug: string;
  options?: boolean;
};

export type LessonListingPageProps = {
  browseData: LessonListingBrowseData;
  backLink: PupilLessonListingBackLink;
};

const PupilLessonListingPage = ({
  browseData,
  backLink,
}: LessonListingPageProps) => {
  const unitData = browseData[0]?.unitData;
  const programmeFields = browseData[0]?.programmeFields;
  const programmeSlug = browseData[0]?.programmeSlug;

  const orderedBrowseData = browseData.sort((a, b) => {
    const aLessonOrder = a.supplementaryData?.orderInUnit;
    const bLessonOrder = b.supplementaryData?.orderInUnit;
    return aLessonOrder - bLessonOrder;
  });

  if (
    unitData === undefined ||
    programmeFields === undefined ||
    programmeSlug === undefined
  ) {
    throw new Error("unitData or programmeFields is undefined");
  }

  const [resolvedOakHref, setResolvedOakHref] = useState(() =>
    backLink.options
      ? resolveOakHref({
          page: "pupil-programme-index",
          programmeSlug: backLink.programmeSlug,
          optionSlug: "options",
        })
      : resolveOakHref({
          page: "pupil-unit-index",
          programmeSlug: backLink.programmeSlug,
        }),
  );

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const referrer = document.referrer;

    if (referrer) {
      const referrerURL = new URL(referrer);
      const currentURL = new URL(window.location.href);
      if (
        referrerURL.origin === currentURL.origin &&
        referrerURL.pathname.split("/").pop() === "units"
      ) {
        setResolvedOakHref(referrer);
      }
    }
  }, []);

  return (
    <PupilViewsLessonListing
      unitData={unitData}
      programmeFields={programmeFields}
      orderedCurriculumData={orderedBrowseData}
      programmeSlug={programmeSlug}
      backLink={resolvedOakHref}
    />
  );
};

export const getStaticPaths =
  getStaticPathsTemplate<PupilLessonListingURLParams>;

export const getStaticProps: GetStaticProps<
  LessonListingPageProps,
  PupilLessonListingURLParams
> = async (context) => {
  return getPageProps({
    page: "pupil-lesson-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("no context.params");
      }
      const { programmeSlug, unitSlug } = context.params;
      if (!programmeSlug || !unitSlug) {
        throw new Error("unexpected context.params");
      }

      // validate the programmeSlug ahead of the call to the API
      validateProgrammeSlug(programmeSlug);

      const { browseData, backLinkData } =
        await curriculumApi2023.pupilLessonListingQuery({
          programmeSlug,
          unitSlug,
        });

      const filteredBrowseData = browseData.filter(
        (lesson) => !lesson.lessonData.deprecatedFields?.isSensitive,
      );

      if (!filteredBrowseData || filteredBrowseData.length === 0) {
        return {
          notFound: true,
        };
      }

      /**
       *
       * Backlink cases to handle:
       *
       * 1. its a non-legacy programme => programmeSlug
       * 2. legacy programme equivalent in the backLinkData => nonLegacyProgrammeSlug
       * 3. legacy programme not in the backLinkData & backLinkData has multiple entries => baseSlug/options
       * 4. legacy programme not in the backLinkData & backLinkData has a single entry => backLinkData.programmeSlug
       *
       */

      const backLink: PupilLessonListingBackLink = (() => {
        const matches = /^([a-z-]*?)-(primary|secondary)-year-\d{1,2}/.exec(
          programmeSlug,
        );

        const baseSlug = matches?.[0];
        const nonLegacyProgrammeSlug = programmeSlug.replace(/-l$/, "");
        const backLinkEquivalent = backLinkData.find(
          (b) => b.programmeSlug === nonLegacyProgrammeSlug,
        );

        if (!baseSlug) {
          throw new Error("programme slug does not match expected pattern");
        }

        switch (true) {
          case !programmeSlug.endsWith("-l"):
            return { programmeSlug };
          case backLinkEquivalent !== undefined:
            return { programmeSlug: backLinkEquivalent.programmeSlug };
          case backLinkData.length > 1:
            return { programmeSlug: baseSlug, options: true };
          case backLinkData[0]?.programmeSlug !== undefined:
            return { programmeSlug: backLinkData[0].programmeSlug };
          default:
            return { programmeSlug };
        }
      })();

      const results: GetStaticPropsResult<LessonListingPageProps> = {
        props: {
          browseData: filteredBrowseData,
          backLink,
        },
      };
      return results;
    },
  });
};

export default PupilLessonListingPage;
