import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { patchDocument } from "@btitterington_org/docx";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import curriculumApi2023, {
  CurriculumOverviewMVData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import CMSClient from "@/node-lib/cms";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import {
  download,
  formattedDate,
} from "@/components/CurriculumComponents/DocxPOC/util";
import LiveDataSection from "@/components/CurriculumComponents/DocxPOC/components/LiveDataSection";
// import {
//   subjectPatch,
//   curriculumExplainerPatch,
//   linkToNewUnitTablePatch,
//   subjectPrinciplesListPatch,
//   unitListTablePatch,
// } from "@/components/CurriculumComponents/DocxPOC/patches";

export type CombinedCurriculumData = CurriculumOverviewMVData &
  CurriculumOverviewSanityData &
  CurriculumUnitsTabData;

type PageProps = {
  combinedCurriculumData: CombinedCurriculumData;
  examboardSlug: string;
};

export default function Page({
  combinedCurriculumData,
  examboardSlug,
}: PageProps) {
  console.log({ combinedCurriculumData });

  const pageTitle = `${combinedCurriculumData?.subjectTitle} - ${combinedCurriculumData?.phaseTitle}${
    examboardSlug ? ` - ${examboardSlug.toLocaleUpperCase()}` : ""
  }`;

  const handleLiveDataClick = (file: File) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      if (!event.target?.result) {
        return;
      }
      const fileContent = event.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(fileContent);

      patchDocument(uint8Array, {
        patches: {
          // ...subjectPatch(formData),
          // ...curriculumExplainerPatch(formData),
          // ...linkToNewUnitTablePatch(formData),
          // ...subjectPrinciplesListPatch(formData),
          // ...unitListTablePatch(formData),
        },
      }).then((doc) => {
        download(doc, `${pageTitle} - ${formattedDate(new Date())}.docx`);
      });
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
