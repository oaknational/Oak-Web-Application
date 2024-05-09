import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Element } from "xml-js";

import { unitsTablePatch } from "./patches/unitsTable";
import { subjectPatch } from "./patches/subject";
import { tableOfContentsPatch } from "./patches/tableOfContents";
import { subjectExplainerPatch } from "./patches/subjectExplainer";
import { partnerDetailPatch } from "./patches/partnerDetail";
import { partnerNamePatch } from "./patches/partnerName";
import { yearPatch } from "./patches/year";
import { endOfDocumentPatch } from "./patches/endOfDocument";
import { threadsTablePatch } from "./patches/threadsTable";
import { unitTitlePatch } from "./patches/unitTitle";
import { unitYearPatch } from "./patches/unitYear";
import { unitLessonsPatch } from "./patches/unitLessons";
import { unitThreadsPatch } from "./patches/unitThreads";

import {
  mapOverElements,
  modifyXmlByRootSelector,
  pipeElementThrough,
  withBlock,
} from "@/components/CurriculumComponents/DocxPOC/docx";
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
  const pageTitle = `${combinedCurriculumData?.subjectTitle} - ${combinedCurriculumData?.phaseTitle}${
    examboardSlug ? ` - ${examboardSlug.toLocaleUpperCase()}` : ""
  }`;

  // console.log({ combinedCurriculumData });

  const handleLiveDataClick = (file: File) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      if (!event.target?.result) {
        return;
      }
      const fileContent = event.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(fileContent);

      // NOTE: This is really inefficient at the moment, that's fine for now though
      const patches = [
        unitsTablePatch(combinedCurriculumData),
        subjectPatch(combinedCurriculumData),
        tableOfContentsPatch(),
        subjectExplainerPatch(combinedCurriculumData),
        partnerDetailPatch(combinedCurriculumData),
        partnerNamePatch(combinedCurriculumData),
        yearPatch(),
        threadsTablePatch(),
        endOfDocumentPatch(),
      ];

      const moddedFile = await modifyXmlByRootSelector(
        uint8Array,
        "w:document",
        async (doc) => {
          const newDoc1 = await mapOverElements(
            doc,
            (el: Element, parent?: Element) => {
              return pipeElementThrough(el, parent, patches);
            },
          );

          const newDoc = await withBlock(
            newDoc1!,
            "UNIT_PAGE",
            async (el: Element) => {
              const promises = combinedCurriculumData.units.map((unit) => {
                return mapOverElements(el, (el, parent) => {
                  return pipeElementThrough(el, parent, [
                    unitTitlePatch(unit),
                    unitLessonsPatch(unit),
                    unitThreadsPatch(unit),
                    unitYearPatch(unit),
                  ]);
                });
              });
              return await Promise.all(promises);
            },
          );

          if (!newDoc) {
            throw new Error("Invalid document!");
          }

          return newDoc;
        },
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
