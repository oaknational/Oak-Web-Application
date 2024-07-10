import {
  OakFieldError,
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023, {
  CurriculumOverviewMVData,
  CurriculumUnitsTabDataIncludeNew,
} from "@/node-lib/curriculum-api-2023";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Box from "@/components/SharedComponents/Box";

type CurriculumUnitsTabDataIncludeNewUnit =
  CurriculumUnitsTabDataIncludeNew["units"][number] & {
    order: NonNullable<
      CurriculumUnitsTabDataIncludeNew["units"][number]["order"]
    >;
  };
export type CurriculumUnitsTabDataIncludeNewWithOrder = {
  units: CurriculumUnitsTabDataIncludeNewUnit[];
};

export type CombinedCurriculumData = CurriculumOverviewMVData &
  CurriculumOverviewSanityData &
  CurriculumUnitsTabDataIncludeNewWithOrder & { state: string };

type PageProps = {
  combinedCurriculumData: CombinedCurriculumData;
  examboardSlug: string;
  subjectSlug: string;
  phaseSlug: string;
  state: string;
  dataWarnings: string[];
};

function getMvRefreshTime() {
  // TODO: Replace me with MV last refresh time
  // Test by changing key every 30mins
  return Math.floor(Date.now() / (1000 * 60 * 30));
}

export default function Page({
  combinedCurriculumData,
  subjectSlug,
  phaseSlug,
  examboardSlug,
  state,
  dataWarnings,
}: PageProps) {
  const router = useRouter();
  const onSubmit = async () => {
    const slug = [subjectSlug, phaseSlug, state, examboardSlug].join("/");
    const redirectPath = `/api/curriculum-downloads/${getMvRefreshTime()}/${slug}`;
    router.push(redirectPath);
  };

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: "Curriculum downloads - DOCX POC",
          description: "Curriculum downloads - DOCX POC",
        }),
      }}
      $background={"grey20"}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakFlex $justifyContent={"center"} $background={"mint"}>
          <MaxWidth $ph={16}>
            <OakHeading tag="h1" $font={"heading-3"} $mt="space-between-l">
              {combinedCurriculumData.subjectTitle}
            </OakHeading>
            <OakP $font={"heading-5"} $mb="space-between-s">
              {[
                combinedCurriculumData.phaseTitle,
                combinedCurriculumData.examboardTitle,
              ]
                .filter(Boolean)
                .join(", ")}{" "}
              ({combinedCurriculumData.state})
            </OakP>

            {dataWarnings?.map((warning, index) => (
              <OakFieldError key={index}>{warning}</OakFieldError>
            ))}
            <Box $maxWidth={960} $mb={40} $mt={20}>
              <OakPrimaryButton onClick={onSubmit} iconName="download">
                Generate Document
              </OakPrimaryButton>
            </Box>
          </MaxWidth>
        </OakFlex>
      </OakThemeProvider>
    </AppLayout>
  );
}

interface PageParams {
  slugs: string[];
}

export const getServerSideProps = async ({
  params: {
    slugs: [subjectSlug = "", phaseSlug = "", state = "", examboardSlug = ""],
  },
}: {
  params: PageParams;
}) => {
  let curriculumOverviewSanityData: CurriculumOverviewSanityData | null;
  let curriculumOverviewTabData: CurriculumOverviewMVData | null;
  let curriculumData: CurriculumUnitsTabDataIncludeNewWithOrder | null;
  const dataWarnings: string[] = [];

  try {
    const curriculumDataUnsorted =
      await curriculumApi2023.curriculumUnitsIncludeNew({
        subjectSlug,
        phaseSlug,
        examboardSlug,
        state,
      });

    // HACK: This sorts by examboard to push NULLs to the bottom of the list, to fix picking up the correct `unit_options`
    curriculumData = {
      ...curriculumDataUnsorted,
      units: [...curriculumDataUnsorted.units]
        .sort((a) => {
          if (a.examboard) {
            return -1;
          }
          return 1;
        })
        .map((unit) => {
          return {
            ...unit,
            order: unit.order === null ? -1000 : unit.order,
          };
        })
        .sort((a, b) => {
          return a.order - b.order;
        }),
    };
    try {
      curriculumOverviewTabData = await curriculumApi2023.curriculumOverview({
        subjectSlug,
        phaseSlug,
      });
    } catch (error) {
      dataWarnings.push("Overview data is missing, dummy data will be used.");
      curriculumOverviewTabData = {
        curriculaDesc:
          "Curricula description is undefined for this record. Please check the CMS.",
        subjectTitle:
          "Subject title is undefined for this record. Please check the CMS.",
        phaseTitle:
          "Phase title is undefined for this record. Please check the CMS.",
        examboardTitle: null,
      };
    }

    curriculumOverviewSanityData = await CMSClient.curriculumOverviewPage({
      previewMode: false,
      ...{ subjectSlug, phaseSlug },
    });

    if (!curriculumOverviewSanityData) {
      dataWarnings.push("Sanity CMS data is missing, dummy data will be used.");
      curriculumOverviewSanityData = {
        id: "001ae718-80a4-42ef-8dea-809528ecc847",
        subjectPrinciples: [
          "Subject principles are undefined for this record. Please check the CMS.",
        ],
        partnerBio:
          "Partner bio is undefined for this record. Please check the CMS.",
        curriculumPartner: {
          name: "Partner name is undefined for this record. Please check the CMS.",
          image: null,
        },
        video: {
          title:
            "Video title is undefined for this record. Please check the CMS.",
          video: {
            asset: { assetId: "", playbackId: "undefined", thumbTime: null },
          },
        },
        videoAuthor:
          "Video author is undefined for this record. Please check the CMS.",
        videoExplainer:
          "Video explainer is undefined for this record. Please check the CMS.",
      };
    }

    if (
      !curriculumOverviewSanityData ||
      !curriculumOverviewTabData ||
      !curriculumData
    ) {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }

  const subjectPhaseOptions = {
    subjects: await curriculumApi2023.subjectPhaseOptionsIncludeNew(),
  };

  const subject = subjectPhaseOptions.subjects.find((subject) => {
    return subject.slug === subjectSlug && subject.state === state;
  }) as SubjectPhasePickerData["subjects"][number] | undefined;
  const examboard =
    subject?.examboards?.find(
      (examboard) => examboard.slug === examboardSlug,
    ) ?? null;

  const combinedCurriculumData: CombinedCurriculumData = {
    ...curriculumData,
    ...curriculumOverviewTabData,
    ...curriculumOverviewSanityData,
    ...{ state },
    examboardTitle: examboard?.title ?? null,
  };

  return {
    props: {
      combinedCurriculumData,
      examboardSlug, // Temporary, as it seems the examboard value isn't being brought over in CurriculumOverviewMVData
      subjectSlug,
      phaseSlug,
      state,
      dataWarnings,
    },
  };
};
