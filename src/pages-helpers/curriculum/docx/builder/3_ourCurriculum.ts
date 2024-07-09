import { join } from "path";

import type JSZip from "jszip";

import { cdata, safeXml, xmlElementToJson } from "../xml";
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
      title: "Diverse",
      text: "We prioritise creating a diverse curriculum by committing to diversity in teaching and teachers, and the language, texts and media we use, so all pupils feel positively represented.",
    },
    {
      title: "Accessible",
      text: "Creating an accessible curriculum that addresses the needs of all pupils and meets accessibility guidelines and requirements.",
    },
    {
      title: "Evidence-informed",
      text: "We take an evidence-informed approach applying the science of learning and subject-specific research.",
    },
    {
      title: "Sequenced and coherent",
      text: "Careful sequencing and attention to building coherence via vertical threads so that pupils build on prior knowledge and make meaningful connections.",
    },
    {
      title: "Flexible",
      text: "Our flexible curriculum enables schools to tailor our content to their curriculum and context.",
    },
  ];

  function groupedIntoSets<T>(input: T[], count: number): T[][] {
    const output: T[][] = [];
    for (let i = 0; i < input.length; i += 2) {
      const group: T[] = [];
      output.push(group);
      for (let j = 0; j < count; j++) {
        group[j] = input[i + j]!;
      }
    }
    return output;
  }

  function createTable() {
    return safeXml`
      <w:tbl>
        <w:tblPr>
          <w:tblW w:type="pct" w:w="100%" />
          <w:tblBorders>
            <w:top w:val="single" w:color="F5E9F2" w:sz="48" />
            <w:left w:val="single" w:color="F5E9F2" w:sz="48" />
            <w:bottom w:val="single" w:color="F5E9F2" w:sz="48" />
            <w:right w:val="single" w:color="F5E9F2" w:sz="48" />
            <w:insideH w:val="single" w:color="auto" w:sz="4" />
            <w:insideV w:val="single" w:color="auto" w:sz="4" />
          </w:tblBorders>
        </w:tblPr>
        <w:tblGrid>
          <w:gridCol w:w="10515" />
        </w:tblGrid>
        ${groupedIntoSets(points, 2)
          .flatMap((row) => {
            const rows = row.map((point, columnIndex) => {
              return safeXml`
                <w:tc>
                  <w:tcPr>
                    <w:tcW w:type="pct" w:w="50%" />
                    <w:tcBorders>
                      <w:top w:val="single" w:color="FFFFFF" w:sz="0" />
                      <w:start w:val="single" w:color="FFFFFF" w:sz="0" />
                      <w:bottom w:val="single" w:color="FFFFFF" w:sz="0" />
                      <w:end w:val="single" w:color="FFFFFF" w:sz="0" />
                    </w:tcBorders>
                    <w:tcMar>
                      <w:top w:type="dxa" w:w="0" />
                      <w:start
                        w:type="dxa"
                        w:w="${columnIndex === 0 ? "0" : "226"}"
                      />
                      <w:bottom w:type="dxa" w:w="226" />
                      <w:end
                        w:type="dxa"
                        w:w="${columnIndex === 1 ? "0" : "226"}"
                      />
                    </w:tcMar>
                  </w:tcPr>
                  <w:p>
                    <w:r>
                      <w:rPr>
                        <w:rFonts
                          w:ascii="Arial"
                          w:hAnsi="Arial"
                          w:cs="Arial"
                        />
                        <w:b />
                        <w:color w:val="222222" />
                        <w:sz w:val="36" />
                      </w:rPr>
                      <w:t>${cdata(point.title)}</w:t>
                    </w:r>
                  </w:p>
                  <w:p>
                    <w:r>
                      <w:rPr>
                        <w:rFonts
                          w:ascii="Arial"
                          w:hAnsi="Arial"
                          w:cs="Arial"
                        />
                        <w:color w:val="222222" />
                        <w:sz w:val="24" />
                      </w:rPr>
                      <w:t>${cdata(point.text)}</w:t>
                    </w:r>
                  </w:p>
                </w:tc>
              `;
            });

            return `<w:tr>${rows}</w:tr>`;
          })
          .join("")}
      </w:tbl>
    `;
  }

  const pageXml = safeXml`
    <root>
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading2" />
        </w:pPr>
        ${wrapInBookmarkPoint(
          "section_our_curriculum",
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="56" />
              </w:rPr>
              <w:t>${cdata("Our curriculum")}</w:t>
            </w:r>
          `,
        )}
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>
            ${cdata(
              "All of our curricula share the same set of principles that guide our curriculum design to ensure our curricula are high-quality. They are:",
            )}
          </w:t>
        </w:r>
      </w:p>

      ${createTable()}
      <w:p>
        <w:pPr>
          <w:jc w:val="center" />
        </w:pPr>
        <w:r>
          ${createImage(images.oakCurriculum, {
            width: cmToEmu(12.54),
            height: cmToEmu(11.61),
            desc: "A bee hive diagram showing each of Oak's 6 curriculum principles",
          })}
        </w:r>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
