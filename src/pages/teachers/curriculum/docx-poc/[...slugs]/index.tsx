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
import { unitThreadsPatch } from "@/pages-helpers/curriculum/docx-patches/unitThreads";
import { unitPreviousPatch } from "@/pages-helpers/curriculum/docx-patches/unitPrevious";
import { unitNextPatch } from "@/pages-helpers/curriculum/docx-patches/unitNext";
import { unitNumberPatch } from "@/pages-helpers/curriculum/docx-patches/unitNumber";

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
  let pageTitle: string = `${combinedCurriculumData?.subjectTitle} - ${combinedCurriculumData?.phaseTitle} - (${
    combinedCurriculumData.state
  })${examboardSlug ? ` - ${examboardSlug.toLocaleUpperCase()}` : ""}`;

  if (dataWarnings.length > 0) {
    pageTitle = `${capitalizeFirstLetter(
      subjectSlug,
    )} - ${capitalizeFirstLetter(phaseSlug)}${
      examboardSlug ? ` - ${examboardSlug.toLocaleUpperCase()}` : ""
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
        <LiveDataSection
          pageTitle={pageTitle}
          dataWarnings={dataWarnings}
          onClick={handleLiveDataClick}
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
    curriculumData = await curriculumApi2023.curriculumUnitsIncludeNew({
      subjectSlug,
      phaseSlug,
      examboardSlug,
      state,
    });

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

  const combinedCurriculumData: CombinedCurriculumData = {
    ...curriculumData,
    ...curriculumOverviewTabData,
    ...curriculumOverviewSanityData,
    ...{ state },
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
