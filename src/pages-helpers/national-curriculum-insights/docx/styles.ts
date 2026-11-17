import type { Element } from "xml-js";

import type { JSZipCached } from "@/pages-helpers/curriculum/docx/docx";

export const insightsFaqQuestionStyle = "InsightsFaqQuestion";
export const insightsHeadlineStyle = "InsightsHeadline";

const characterStyles = [
  {
    source: "Heading4",
    id: insightsFaqQuestionStyle,
    label: "FAQ question",
  },
  {
    source: "Heading3",
    id: insightsHeadlineStyle,
    label: "headline",
  },
];

export const addInsightsDocxStyles = async (zip: JSZipCached) => {
  const styles = (await zip.readJson("word/styles.xml")) as Element;
  const root = styles.elements?.find((element) => element.name === "w:styles");
  if (!root?.elements) {
    throw new Error("The Word template is missing its FAQ question style.");
  }
  const additions = characterStyles.map(({ source, id, label }): Element => {
    const paragraphStyle = root.elements?.find(
      (element) => element.attributes?.["w:styleId"] === source,
    );
    const formatting = paragraphStyle?.elements?.find(
      (element) => element.name === "w:rPr",
    );
    if (!formatting) {
      throw new Error(`The Word template is missing its ${label} style.`);
    }
    return {
      type: "element",
      name: "w:style",
      attributes: {
        "w:type": "character",
        "w:customStyle": "1",
        "w:styleId": id,
      },
      elements: [
        {
          type: "element",
          name: "w:name",
          attributes: { "w:val": `Insights ${label}` },
        },
        {
          type: "element",
          name: "w:basedOn",
          attributes: { "w:val": "DefaultParagraphFont" },
        },
        {
          ...formatting,
          // Heading2 and Heading3 are bold. Repeating the toggles would cancel it.
          elements: formatting.elements?.filter(
            (element) => !["w:b", "w:bCs"].includes(element.name ?? ""),
          ),
        },
      ],
    };
  });
  root.elements.push(...additions);
  zip.writeJson("word/styles.xml", styles);
};
