import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Element } from "xml-js";

import { unitsTablePatch } from "@/pages-helpers/curriculum/docx-patches/unitsTable";
import { subjectPatch } from "@/pages-helpers/curriculum/docx-patches/subject";
import { tableOfContentsPatch } from "@/pages-helpers/curriculum/docx-patches/tableOfContents";
import { subjectExplainerPatch } from "@/pages-helpers/curriculum/docx-patches/subjectExplainer";
import { partnerDetailPatch } from "@/pages-helpers/curriculum/docx-patches/partnerDetail";
import { partnerNamePatch } from "@/pages-helpers/curriculum/docx-patches/partnerName";
import { yearPatch } from "@/pages-helpers/curriculum/docx-patches/year";
import { endOfDocumentPatch } from "@/pages-helpers/curriculum/docx-patches/endOfDocument";
import { threadsTablePatch } from "@/pages-helpers/curriculum/docx-patches/threadsTable";
import { unitTitlePatch } from "@/pages-helpers/curriculum/docx-patches/unitTitle";
import { unitYearPatch } from "@/pages-helpers/curriculum/docx-patches/unitYear";
import { unitLessonsPatch } from "@/pages-helpers/curriculum/docx-patches/unitLessons";
import { mainThreadsPatch } from "@/pages-helpers/curriculum/docx-patches/mainThreads";
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
import { unitThreadsPatch } from "@/pages-helpers/curriculum/docx-patches/unitThreads";
import { unitPreviousPatch } from "@/pages-helpers/curriculum/docx-patches/unitPrevious";
import { unitNextPatch } from "@/pages-helpers/curriculum/docx-patches/unitNext";
import { unitNumberPatch } from "@/pages-helpers/curriculum/docx-patches/unitNumber";

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
      const moddedFile = await modifyXmlByRootSelector(
        uint8Array,
        "w:document",
        async (doc) => {
          const docMod1 = await mapOverElements(
            doc,
            (el: Element, parent?: Element) => {
              return pipeElementThrough(el, parent, [
                unitsTablePatch(combinedCurriculumData),
                subjectPatch(combinedCurriculumData),
                tableOfContentsPatch(),
                subjectExplainerPatch(combinedCurriculumData),
                partnerDetailPatch(combinedCurriculumData),
                partnerNamePatch(combinedCurriculumData),
                yearPatch(),
                threadsTablePatch(combinedCurriculumData),
                endOfDocumentPatch(),
              ]);
            },
          );

          const docMod2 = await withBlock(
            docMod1!,
            "UNIT_PAGE",
            async (el: Element) => {
              const promises = combinedCurriculumData.units.map(
                (unit, index) => {
                  return mapOverElements(el, (el, parent) => {
                    return pipeElementThrough(el, parent, [
                      unitTitlePatch(unit),
                      unitNumberPatch(unit, index),
                      unitLessonsPatch(unit),
                      unitYearPatch(unit),
                      unitThreadsPatch(unit),
                      unitPreviousPatch(unit),
                      unitNextPatch(unit),
                    ]);
                  });
                },
              );
              return await Promise.all(promises);
            },
          );

          const docMod3 = await withBlock(
            docMod2!,
            "THREAD_PAGE",
            async (el: Element, parent?: Element) => {
              return pipeElementThrough(el, parent, [
                mainThreadsPatch(combinedCurriculumData),
              ]);
            },
          );

          if (!docMod3) {
            throw new Error("Invalid document!");
          }

          return docMod3;
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
