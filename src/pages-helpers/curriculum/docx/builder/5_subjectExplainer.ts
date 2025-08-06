import { safeXml } from "@ooxml-tools/xml";

import { cdata, xmlElementToJson } from "../xml";
import { appendBodyElements, JSZipCached, wrapInBookmarkPoint } from "../docx";

import { getPortableTextTypes, portableTextToDocx } from "./portableText";

import { CombinedCurriculumData } from "@/utils/curriculum/types";

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const explainerXml = await portableTextToDocx(
    data.curriculumExplainer.explainerRaw,
    getPortableTextTypes(zip),
  );

  const pageXml = safeXml`
    <root>
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading2" />
        </w:pPr>
        ${wrapInBookmarkPoint(
          "section_curriculum_overview",
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="56" />
              </w:rPr>
              <w:t>${cdata(`${data.subjectTitle} curriculum explainer`)}</w:t>
            </w:r>
          `,
        )}
      </w:p>
      <w:p />
      <w:p />
      ${explainerXml}
        ${Array(4)
        .fill(true)
        .map(() => safeXml`<w:p />`)}
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
