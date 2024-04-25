import { GetStaticProps, GetStaticPropsResult } from "next";
import Link from "next/link";

import { UnitListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilUnitListing/pupilUnitListing.schema";
import { URLParams } from "@/pages/teachers/programmes/[programmeSlug]/units";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { resolveOakHref } from "@/common-lib/urls";

export { getStaticPaths } from "@/pages/teachers/programmes/[programmeSlug]/units";

type UnitListingPageProps = {
  curriculumData: UnitListingBrowseData;
};

const PupilUnitListingPage = ({ curriculumData }: UnitListingPageProps) => {
  console.log("curriculumData", curriculumData);

  const orderedCurriculumData = curriculumData.sort((a, b) => {
    const aUnitOrder = a.supplementaryData.unitOrder;
    const bUnitOrder = b.supplementaryData.unitOrder;
    return aUnitOrder - bUnitOrder;
  });

  const subject = curriculumData[0]?.programmeFields?.subject;
  const yearDescription = curriculumData[0]?.programmeFields?.yearDescription;
  const tier = curriculumData[0]?.programmeFields?.tier || null;
  const examboard = curriculumData[0]?.programmeFields?.examboard;
  const yearSlug = curriculumData[0]?.programmeFields?.yearSlug || "";
  const examboardSlug =
    curriculumData[0]?.programmeFields?.examboardSlug || null;
  const subjectSlug = curriculumData[0]?.programmeFields?.subjectSlug || "";

  type BackPages =
    | "tier-with-examboard"
    | "tier-without-examboard"
    | "examboard"
    | "subject";

  function pickPreviousPage(): BackPages {
    const hasTier = tier !== null;
    const hasExamboard = examboard !== null;

    switch (true) {
      case hasTier && hasExamboard:
        return "tier-with-examboard";
      case hasTier && !hasExamboard:
        return "tier-without-examboard";
      case hasExamboard && !hasTier:
        return "examboard";
      default:
        return "subject";
    }
  }

  function PickBackHref(
    backPage: BackPages,
  ): [backHref: string, backLabel: string] {
    switch (backPage) {
      case "tier-with-examboard":
        return [
          `${resolveOakHref({
            page: "pupil-programme-index",
            yearSlug,
            subjectSlug,
          })}?examboard=${examboardSlug}`,
          "Select tiers",
        ];
      case "tier-without-examboard":
        return [
          resolveOakHref({
            page: "pupil-programme-index",
            yearSlug,
            subjectSlug,
          }),
          "Select tiers",
        ];
      case "examboard":
        return [
          resolveOakHref({
            page: "pupil-programme-index",
            yearSlug,
            subjectSlug,
          }),
          "Select examboards",
        ];
      case "subject":
      default:
        return [
          resolveOakHref({ page: "pupil-subject-index", yearSlug }),
          "Select subjects",
        ];
    }
  }

  const backPage = pickPreviousPage();
  const [backHref, backLabel] = PickBackHref(backPage);

  return (
    <div>
      <h1>{subject}</h1>
      <h2>{yearDescription}</h2>
      <h3>{tier}</h3>
      <h4>{examboard}</h4>
      <Link href={backHref}>{backLabel}</Link>
      <ol>
        {orderedCurriculumData.map((unit) => {
          return (
            <li key={unit.unitSlug}>
              <Link
                href={resolveOakHref({
                  page: "pupil-lesson-index",
                  programmeSlug: unit.programmeSlug,
                  unitSlug: unit.unitSlug,
                })}
              >
                {unit.unitData?.title} - {unit.lessonCount} lessons
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export const getStaticProps: GetStaticProps<
  UnitListingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "pupil-lesson-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("no context.params");
      }
      const { programmeSlug } = context.params;
      if (!programmeSlug) {
        throw new Error("unexpected context.params");
      }

      const curriculumData = await curriculumApi2023.pupilUnitListingQuery({
        programmeSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<UnitListingPageProps> = {
        props: {
          curriculumData,
        },
      };
      return results;
    },
  });
};

export default PupilUnitListingPage;
