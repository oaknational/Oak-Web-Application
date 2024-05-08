import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Element } from "xml-js";

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
import {
  elementContains,
  elementMapper,
  modifyXmlBySelector,
} from "@/components/CurriculumComponents/DocxPOC/docx";
import { xmlElementToJson } from "@/components/CurriculumComponents/DocxPOC/patches/xml";
import { buildUnitsTable } from "@/components/CurriculumComponents/DocxPOC/patches";

// Safe version of String#includes(...)
const textIncludes = (str: unknown, matchText: string) => {
  if (typeof str === "string") {
    return str.includes(matchText);
  }
  return false;
};

// Safe version of String#replace(...)
const textReplacer = (input: unknown, selector: string, value: string) => {
  if (typeof input === "string") {
    return input.replace(selector, value);
  }
  return input;
};

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

  const handleLiveDataClick = (file: File) => {
    const reader = new FileReader();

    reader.onload = async function (event) {
      if (!event.target?.result) {
        return;
      }
      const fileContent = event.target.result as ArrayBuffer;
      const uint8Array = new Uint8Array(fileContent);

      const moddedFile = await modifyXmlBySelector(
        uint8Array,
        "w:document",
        async (doc) => {
          const newDoc = await elementMapper(
            doc,
            async (el: Element, parent?: Element) => {
              if (el.type === "text" && textIncludes(el.text, "{{SUBJECT}}")) {
                return {
                  type: "text",
                  text: textReplacer(
                    el.text,
                    "{{SUBJECT}}",
                    `${combinedCurriculumData.phaseTitle} ${combinedCurriculumData.subjectTitle}`,
                  ),
                };
              }
              if (el.type === "text" && textIncludes(el.text, "{{TOC}}")) {
                return {
                  type: "text",
                  text: textReplacer(el.text, "{{TOC}}", "TODO"),
                };
              }
              if (
                el.type === "text" &&
                textIncludes(el.text, "{{SUBJECT_EXPLAINER}}")
              ) {
                return {
                  type: "text",
                  text: textReplacer(
                    el.text,
                    "{{SUBJECT_EXPLAINER}}",
                    combinedCurriculumData.curriculaDesc,
                  ),
                };
              }
              if (
                el.type === "text" &&
                textIncludes(el.text, "{{PARTNER_DETAIL}}")
              ) {
                return {
                  type: "text",
                  text: textReplacer(
                    el.text,
                    "{{PARTNER_DETAIL}}",
                    combinedCurriculumData.partnerBio,
                  ),
                };
              }
              if (
                el.type === "text" &&
                textIncludes(el.text, "{{PARTNER_NAME}}")
              ) {
                return {
                  type: "text",
                  text: textReplacer(
                    el.text,
                    "{{PARTNER_NAME}}",
                    combinedCurriculumData.curriculumPartner.name,
                  ),
                };
              }
              if (el.type === "text" && textIncludes(el.text, "{{YEAR}}")) {
                return {
                  type: "text",
                  text: textReplacer(el.text, "{{YEAR}}", "TODO"),
                };
              }
              if (
                el.type === "text" &&
                textIncludes(el.text, "{{TRANSITION_YEAR}}")
              ) {
                return {
                  type: "text",
                  text: textReplacer(el.text, "{{TRANSITION_YEAR}}", "TODO"),
                };
              }
              if (
                el.type === "element" &&
                el.name === "w:p" &&
                elementContains(
                  el,
                  (el: Element) =>
                    el.type === "text" &&
                    textIncludes(el.text, "{{UNIT_TABLE}}"),
                )
              ) {
                const out = xmlElementToJson(`<w:sectPr></w:sectPr>`);
                out.elements = await buildUnitsTable(
                  combinedCurriculumData.units,
                );
                return out;
              }
              if (
                parent?.name === "w:body" &&
                elementContains(
                  el,
                  (el: Element) =>
                    el.type === "text" &&
                    textIncludes(el.text, "{{END_DOCUMENT}}"),
                )
              ) {
                // This is here so we can hide assets after this marker in the document
                return;
              }
              if (
                el.type === "element" &&
                el.name === "w:p" &&
                elementContains(
                  el,
                  (el: Element) =>
                    el.type === "text" &&
                    textIncludes(el.text, "{{THREADS_TABLE}}"),
                )
              ) {
                return xmlElementToJson(`
                  <w:p>
                    <w:r>
                      <w:rPr>
                        <w:color w:val="222222"/>
                      </w:rPr>
                      <w:t xml:space="preserve">TODO:Threads</w:t>
                    </w:r>
                  </w:p>
                `);
              }
              if (
                el.type === "element" &&
                el.name === "w:p" &&
                elementContains(
                  el,
                  (el: Element) =>
                    el.type === "text" &&
                    textIncludes(el.text, "{{TRANSITION_TABLE}}"),
                )
              ) {
                return xmlElementToJson(`
                  <w:p>
                    <w:r>
                      <w:rPr>
                        <w:color w:val="222222"/>
                      </w:rPr>
                      <w:t xml:space="preserve">TODO:Transition table</w:t>
                    </w:r>
                  </w:p>
                `);
              }
              return el;
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
