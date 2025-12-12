import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import {
  ProgrammeFields,
  examboardSlugs,
  pathwaySlugs,
} from "@oaknational/oak-curriculum-schema";

import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { resolveOakHref } from "@/common-lib/urls";
import { getAvailableProgrammeFactor } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";
import { PupilViewsProgrammeListingProps } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

export type OptionsURLParams = {
  programmeSlug: string;
  examboardSlug?: string;
  pathwaySlug?: string;
};

export const getPupilOptionData = async (
  context: GetStaticPropsContext<OptionsURLParams>,
): Promise<GetStaticPropsResult<PupilViewsProgrammeListingProps>> => {
  if (!context.params?.programmeSlug) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  // For the options route we rename programmeSlug to baseSlug as this is the accurate usage of the options page.
  // I would have created a new folder [baseSlug] but multiple dynamic params on the same segment is not allowed.
  const {
    programmeSlug: baseSlug,
    examboardSlug = null,
    pathwaySlug = null,
  } = context.params;

  if (examboardSlug !== null && !isExamboardSlug(examboardSlug)) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  if (pathwaySlug !== null && !isPathwaySlug(pathwaySlug)) {
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

  if (
    programmes.filter((p) => p?.programmeFields.legacy !== "true").length === 1
  ) {
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

  // these get the inital values for the SSR but subsequent values are dynamically produced by the client taking state into account
  const examboards = getAvailableProgrammeFactor({
    factorPrefix: "examboard",
    programmes,
  });
  const tiers = getAvailableProgrammeFactor({
    factorPrefix: "tier",
    programmes,
  });
  const pathways = getAvailableProgrammeFactor({
    factorPrefix: "pathway",
    programmes,
  });

  return {
    props: {
      programmes,
      baseSlug,
      yearSlug,
      examboardSlug,
      examboards,
      tiers,
      pathways,
      pathwaySlug,
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

export const isPathwaySlug = (
  pathwaySlug: ProgrammeFields["pathway_slug"] | string | null,
): pathwaySlug is ProgrammeFields["pathway_slug"] =>
  Object.keys(pathwaySlugs.Values).includes(pathwaySlug ?? "");
