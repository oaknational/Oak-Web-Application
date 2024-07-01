import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";

import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  wrapInBookmarkPoint,
} from "./helper";

export default async function generate(zip: JSZip) {
  const images = await insertImages(zip, {
    oakCurriculum:
      "src/pages-helpers/curriculum/docx/builder/images/oak-curriculum.png",
  });

  const points = [
    {
      title: "Knowledge and vocabulary rich",
      text: "Lessons and units are knowledge and vocabulary rich so that pupils build on what they already know to develop powerful knowledge.",
    },
    {
      title: "Accessible",
      text: "Creating an accessible curriculum that addresses the needs of all pupils is achieved to accessibility guidelines and requirements.",
    },
    {
      title: "Sequenced and coherent",
      text: "Knowledge is sequenced and mapped in a coherent format so that pupils make meaningful connections.",
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
      text: "Our curriculum is evidence-informed through rigorous application of best practice and the science of learning.",
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
                            <w:t>${cdata(point.title)}</w:t>
                        </w:r>
                    </w:p>
                    <w:p>
                        <w:r>
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
