import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import LiveDataSection from "@/components/CurriculumComponents/DocxPOC/components/LiveDataSection";
import {
  download,
  formattedDate,
} from "@/components/CurriculumComponents/DocxPOC/util";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023, {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import CurriculumDownlodsPatch, {
  CombinedCurriculumData,
} from "@/pages-helpers/curriculum/docx/curriculum-download-patcher";

type PageProps = {
  combinedCurriculumData: CombinedCurriculumData;
  examboardSlug: string;
};

export default function Page({
  combinedCurriculumData,
  examboardSlug,
}: PageProps) {
  const pageTitle = `${combinedCurriculumData?.subjectTitle} - ${combinedCurriculumData?.phaseTitle}${
    examboardSlug ? ` - ${examboardSlug.toLocaleUpperCase()}` : ""
  }`;

  const handleLiveDataClick = (file: File) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      if (!event.target?.result) {
        return;
      }
      const fileContent = event.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(fileContent);
      const moddedFile = await CurriculumDownlodsPatch(
        uint8Array,
        combinedCurriculumData,
        examboardSlug,
      );

      download(moddedFile, `${pageTitle} - ${formattedDate(new Date())}.docx`);
    };

    // Read the file as an ArrayBuffer (binary string)
    reader.readAsArrayBuffer(file);
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
        <LiveDataSection pageTitle={pageTitle} onClick={handleLiveDataClick} />
      </OakThemeProvider>
    </AppLayout>
  );
}

interface PageParams {
  slugs: string[];
}

export const getServerSideProps = async ({
  params: {
    slugs: [subjectSlug = "", phaseSlug = "", examboardSlug = ""],
  },
}: {
  params: PageParams;
}) => {
  let curriculumOverviewSanityData: CurriculumOverviewSanityData | null;
  let curriculumOverviewTabData: CurriculumOverviewMVData | null;
  let curriculumData: CurriculumUnitsTabData | null;
  try {
    curriculumData = await curriculumApi2023.curriculumUnits({
      subjectSlug,
      phaseSlug,
      examboardSlug,
    });

    curriculumOverviewTabData = await curriculumApi2023.curriculumOverview({
      subjectSlug,
      phaseSlug,
    });

    curriculumOverviewSanityData = await CMSClient.curriculumOverviewPage({
      previewMode: false,
      ...{ subjectSlug, phaseSlug },
    });

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

  const combinedCurriculumData: CombinedCurriculumData = {
    ...curriculumData,
    ...curriculumOverviewTabData,
    ...curriculumOverviewSanityData,
  };

  return {
    props: {
      combinedCurriculumData,
      examboardSlug, // Temporary, as it seems the examboard value isn't being brought over in CurriculumOverviewMVData
    },
  };
};
