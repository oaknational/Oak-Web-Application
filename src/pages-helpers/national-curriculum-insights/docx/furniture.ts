import { cdata, safeXml } from "@ooxml-tools/xml";
import type { Element } from "xml-js";

import { writeInsightsDocxRelationships } from "./relationships";

import {
  mapOverElements,
  type JSZipCached,
} from "@/pages-helpers/curriculum/docx/docx";
import {
  jsonXmlToXmlString,
  xmlElementToJson,
} from "@/pages-helpers/curriculum/docx/xml";

export const fillInsightsDocxFurniture = async (
  zip: JSZipCached,
  title: string,
  guidanceUrl: string,
) => {
  zip.writeString(
    "word/header1.xml",
    (await zip.readString("word/header1.xml")).replace(
      "{{title}}",
      cdata(title),
    ),
  );
  const footer = await zip.readJson("word/footer1.xml");
  const replace = (element: Element): boolean => {
    if (
      element.type === "text" &&
      typeof element.text === "string" &&
      element.text.includes("{{url}}")
    ) {
      element.text = element.text.replace("{{url}}", "the guidance page");
      return true;
    }
    return element.elements?.some(replace) ?? false;
  };
  const updated = await mapOverElements(footer as Element, (element) => {
    if (element.name !== "w:r" || !replace(element))
      return Promise.resolve(element);
    return Promise.resolve(
      xmlElementToJson(safeXml`
        <w:hyperlink r:id="rIdGuidance">
          ${jsonXmlToXmlString(element)}
        </w:hyperlink>
      `),
    );
  });
  zip.writeJson("word/footer1.xml", updated!);
  const relationships = await zip.readJson("word/_rels/footer1.xml.rels");
  relationships.elements[0].elements.push({
    type: "element",
    name: "Relationship",
    attributes: {
      Id: "rIdGuidance",
      Type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
      Target: guidanceUrl,
      TargetMode: "External",
    },
  });
  writeInsightsDocxRelationships(
    zip,
    "word/_rels/footer1.xml.rels",
    relationships as Element,
  );
};
