import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import _ from "lodash";
import {
  ProgrammeFields,
  examboardSlugs,
} from "@oaknational/oak-curriculum-schema";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { resolveOakHref } from "@/common-lib/urls";
import { getAvailableProgrammeFactor } from "@/components/PupilViews/PupilProgrammeListing/getAvailableProgrammeFactor";
import { ExamboardData } from "@/components/PupilComponents/BrowseExamboardSelector";
import { TierData } from "@/components/PupilComponents/BrowseTierSelector";

export type OptionsURLParams = {
  programmeSlug: string;
  examboardSlug?: string;
};

export type ProgrammesPageProps = {
  baseSlug: string;
  programmes: PupilProgrammeListingData[];
  yearSlug: PupilProgrammeListingData["yearSlug"];
  examboardSlug: ProgrammeFields["examboard_slug"] | null;
  examboards: ExamboardData[];
  tiers: TierData[];
};

export const getPupilOptionData = async (
  context: GetStaticPropsContext<OptionsURLParams>,
): Promise<GetStaticPropsResult<ProgrammesPageProps>> => {
  if (!context.params || !context.params.programmeSlug) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  // For the options route we rename programmeSlug to baseSlug as this is the accurate usage of the options page.
  // I would have created a new folder [baseSlug] but multiple dynamic params on the same segment is not allowed.
  const { programmeSlug: baseSlug, examboardSlug: rawExamboardSlug = null } =
    context.params;

  let examboardSlug: ProgrammeFields["examboard_slug"] | null = null;
  if (rawExamboardSlug) {
    if (!isExamboardSlug(rawExamboardSlug)) {
      throw new OakError({ code: "curriculum-api/params-incorrect" });
    }
    examboardSlug = rawExamboardSlug;
  }

  if (examboardSlug && !isExamboardSlug(examboardSlug)) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  const programmes = await curriculumApi2023.pupilProgrammeListingQuery({
    baseSlug,
  });

  if (!programmes || programmes.length === 0) {
    return {
      notFound: true,
    };
  }

  if (programmes.length === 1) {
    return {
      redirect: {
        destination: resolveOakHref({
          page: "pupil-unit-index",
          programmeSlug: baseSlug,
        }),
        permanent: false,
      },
    };
  }

  const yearSlug = getYearSlug({ programmes });
  const examboards = getExamboards(programmes);
  const tiers = getTiers(programmes);

  return {
    props: {
      programmes,
      baseSlug,
      yearSlug,
      examboardSlug: examboardSlug,
      examboards,
      tiers,
    },
  };
};

export const getYearSlug = ({
  programmes,
}: {
  programmes: PupilProgrammeListingData[];
}) => {
  const yearSlug = programmes[0]?.yearSlug;

  if (
    programmes.filter((programme) => programme.yearSlug !== yearSlug).length >
      0 ||
    !yearSlug
  ) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }
  return yearSlug;
};

export const isExamboardSlug = (
  examboardSlug: ProgrammeFields["examboard_slug"] | string | null,
): examboardSlug is ProgrammeFields["examboard_slug"] =>
  Object.keys(examboardSlugs.Values).includes(examboardSlug ?? "");

const getExamboards = (programmes: PupilProgrammeListingData[]) => {
  const allExamboards: { [key: string]: ExamboardData[] } = _.groupBy(
    getAvailableProgrammeFactor({
      programmes,
      factorPrefix: "examboard",
    }) as ExamboardData[],
    (examboard: ExamboardData) => examboard.examboard,
  );

  // This creates an array of examboards giving preference to non-legacy examboards
  const examboards = Object.keys(allExamboards)
    .map((examboard) => {
      const mappedExamboard = allExamboards[examboard];
      if (!Array.isArray(mappedExamboard) || mappedExamboard.length < 1) return;
      return (
        allExamboards[examboard]?.find(
          (examboard: ExamboardData) => !examboard.isLegacy,
        ) ?? mappedExamboard[0]
      );
    })
    .filter((examboard): examboard is ExamboardData => examboard !== undefined);

  return examboards;
};

const getTiers = (programmes: PupilProgrammeListingData[]) => {
  const allTiers: { [key: string]: TierData[] } = _.groupBy(
    getAvailableProgrammeFactor({
      programmes: programmes,
      factorPrefix: "tier",
    }) as TierData[],
    (tier: TierData) => tier.tier,
  );

  // This creates an array of tiers giving preference to non-legacy tiers
  const tiers = Object.keys(allTiers)
    .map((tierLabel) => {
      const mappedTier = allTiers[tierLabel];
      if (!Array.isArray(mappedTier) || mappedTier.length < 1) return;
      return (
        allTiers[tierLabel]?.find((tier: TierData) => !tier.isLegacy) ??
        mappedTier[0]
      );
    })
    .filter((tier): tier is TierData => tier !== undefined);

  return tiers;
};
