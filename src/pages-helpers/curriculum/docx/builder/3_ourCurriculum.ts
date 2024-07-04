import { join } from "path";

import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  wrapInBookmarkPoint,
} from "../docx";

export default async function generate(zip: JSZip) {
  const images = await insertImages(zip, {
    oakCurriculum: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/oak-curriculum.png",
    ),
  });

  const points = [
    {
      title: "Knowledge and vocabulary rich",
      text: "Lessons and units are knowledge and vocabulary rich. Pupils will build on what they already know to develop deep knowledge and apply this knowledge in the form of skills.",
    },
    {
      title: "Accessible",
      text: "Creating an accessible curriculum that addresses the needs of all pupils and meets accessibility guidelines and requirements.",
    },
    {
      title: "Sequenced and coherent",
      text: "Careful sequencing and attention to building coherence via vertical threads so that pupils build on prior knowledge and make meaningful connections.",
    },
    {
      title: "Diverse",
      text: "We prioritise creating a diverse curriculum by committing to diversity in teaching and teachers, and the language, texts and media we use, so all pupils feel positively represented.",
    },
    {
      title: "Flexible",
      text: "Our flexible curriculum enables schools to tailor our content to their curriculum and context.",
    },
    {
      title: "Evidence-informed",
      text: "We take an evidence-informed approach applying the science of learning and subject-specific research.",
    },
  ];

  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                ${wrapInBookmarkPoint(
                  "section_our_curriculum",
                  `
                    <w:r>
                        <w:rPr>
                              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                              <w:color w:val="222222"/>
                              <w:sz w:val="56"/>
                              <w:b/>
                        </w:rPr>
                        <w:t>${cdata("Our curriculum")}</w:t>
                    </w:r>
                `,
                )}
            </w:p>

            ${points
              .map((point) => {
                return `
                    <w:p>
                        <w:r>
                            <w:rPr>
                                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                  <w:color w:val="222222"/>
                                  <w:sz w:val="36"/>
                                  <w:b/>
                            </w:rPr>
                            <w:t>${cdata(point.title)}</w:t>
                        </w:r>
                    </w:p>
                    <w:p>
                        <w:r>
                            <w:rPr>
                                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                  <w:color w:val="222222"/>
                                  <w:sz w:val="24"/>
                            </w:rPr>
                            <w:t>${cdata(point.text)}</w:t>
                        </w:r>
                    </w:p>
                `;
              })
              .join("")}

            <w:p>
                <w:r>
                    ${createImage(images.oakCurriculum, {
                      width: cmToEmu(13.53),
                      height: cmToEmu(12.53),
                      desc: "A bee hive diagram showing each of Oak's 6 curriculum principles",
                    })}
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:br w:type="page"/>
                </w:r>
            </w:p>
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
