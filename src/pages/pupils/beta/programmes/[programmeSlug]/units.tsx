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

  if (!curriculumData[0]) {
    throw new Error("No curriculum data");
  }

  const orderedCurriculumData = curriculumData.sort((a, b) => {
    const aUnitOrder = a.supplementaryData.unitOrder;
    const bUnitOrder = b.supplementaryData.unitOrder;
    return aUnitOrder - bUnitOrder;
  });

  const { programmeFields } = curriculumData[0];
  const {
    subject,
    yearDescription,
    tier,
    examboard,
    yearSlug,
    examboardSlug,
    subjectSlug,
  } = programmeFields;

  function pickPreviousPage(): [backHref: string, backLabel: string] {
    const hasTier = tier !== null;
    const hasExamboard = examboard !== null;

    switch (true) {
      case hasTier && hasExamboard:
        return [
          `${resolveOakHref({
            page: "pupil-programme-index",
            yearSlug,
            subjectSlug,
          })}?examboard=${examboardSlug}`,
          "Select tiers",
        ];
      case hasTier && !hasExamboard:
        return [
          resolveOakHref({
            page: "pupil-programme-index",
            yearSlug,
            subjectSlug,
          }),
          "Select tiers",
        ];
      case hasExamboard && !hasTier:
        return [
          resolveOakHref({
            page: "pupil-programme-index",
            yearSlug,
            subjectSlug,
          }),
          "Select examboards",
        ];
      default:
        return [
          resolveOakHref({ page: "pupil-subject-index", yearSlug }),
          "Select subjects",
        ];
    }
  }

  const [backHref, backLabel] = pickPreviousPage();

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
