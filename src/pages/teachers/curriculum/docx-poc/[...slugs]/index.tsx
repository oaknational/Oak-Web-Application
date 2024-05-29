import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import { fetchSubjectPhasePickerData } from "../..";

import LiveDataSection from "@/components/CurriculumComponents/DocxPOC/components/LiveDataSection";
import {
  capitalizeFirstLetter,
  download,
  formattedDate,
} from "@/components/CurriculumComponents/DocxPOC/util";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023, {
  CurriculumOverviewMVData,
  CurriculumUnitsTabDataIncludeNew,
} from "@/node-lib/curriculum-api-2023";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  CurriculumDownlodsCycle1Patch,
  CurriculumDownlodsCycle2Patch,
} from "@/pages-helpers/curriculum/docx/curriculum-download-patcher";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
// import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

export type CombinedCurriculumData = CurriculumOverviewMVData &
  CurriculumOverviewSanityData &
  CurriculumUnitsTabDataIncludeNew & { state: string };

type PageProps = {
  combinedCurriculumData: CombinedCurriculumData;
  examboardSlug: string;
  subjectSlug: string;
  phaseSlug: string;
  state: string;
  dataWarnings: string[];
};

export default function Page({
  combinedCurriculumData,
  examboardSlug,
  subjectSlug,
  phaseSlug,
  state,
  dataWarnings,
}: PageProps) {
  const router = useRouter();
  let pageTitle: string = `${combinedCurriculumData?.subjectTitle} - ${combinedCurriculumData?.phaseTitle} - (${
    combinedCurriculumData.state
  })${
    combinedCurriculumData.examboardTitle
      ? ` - ${combinedCurriculumData.examboardTitle}`
      : ""
  }`;

  if (dataWarnings.length > 0) {
    pageTitle = `${capitalizeFirstLetter(
      subjectSlug,
    )} - ${capitalizeFirstLetter(phaseSlug)}${
      combinedCurriculumData.examboardTitle
        ? ` - ${combinedCurriculumData.examboardTitle}`
        : ""
    } (${capitalizeFirstLetter(state)})`;
  }

  const handleLiveDataClick = (file: File) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      if (!event.target?.result) {
        return;
      }
      const fileContent = event.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(fileContent);
      const patcher =
        state === "new"
          ? CurriculumDownlodsCycle2Patch
          : CurriculumDownlodsCycle1Patch;
      const moddedFile = await patcher(uint8Array, combinedCurriculumData);

      download(moddedFile, `${pageTitle} - ${formattedDate(new Date())}.docx`);
    };

    // Read the file as an ArrayBuffer (binary string)
    reader.readAsArrayBuffer(file);
  };

  const onChangeState = (newState: string) => {
    const url = `/teachers/curriculum/docx-poc/${subjectSlug}/${phaseSlug}/${newState}/${examboardSlug}`;
    router.push(url);
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
        <LiveDataSection
          pageTitle={pageTitle}
          dataWarnings={dataWarnings}
          onClick={handleLiveDataClick}
          state={state}
          onChangeState={onChangeState}
        />
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
  let curriculumData: CurriculumUnitsTabDataIncludeNew | null;
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

  const subjectPhaseOptions = await fetchSubjectPhasePickerData();

  const subject = subjectPhaseOptions.subjects.find(
    (subject) => subject.slug === subjectSlug,
  ) as SubjectPhasePickerData["subjects"][number] | undefined;
  const examboard =
    subject?.examboards?.find(
      (examboard) => examboard.slug === examboardSlug,
    ) ?? null;

  const combinedCurriculumData: CombinedCurriculumData = {
    ...curriculumData,
    ...curriculumOverviewTabData,
    ...curriculumOverviewSanityData,
    ...{ state },
    examboardTitle: examboard?.title,
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
