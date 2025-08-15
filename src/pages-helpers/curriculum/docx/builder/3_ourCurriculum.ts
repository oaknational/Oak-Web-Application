import { join } from "path";

import { cdata, safeXml } from "@ooxml-tools/xml";

import { xmlElementToJson } from "../xml";
import {
  appendBodyElements,
  cmToEmu,
  cmToTwip,
  createImage,
  insertImages,
  JSZipCached,
  wrapInBookmarkPoint,
} from "../docx";

export default async function generate(zip: JSZipCached) {
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
      title: "Sequenced and coherent",
      text: "Careful sequencing and attention to building coherence via vertical threads so that pupils build on prior knowledge and make meaningful connections.",
    },
    {
      title: "Flexible",
      text: "Our flexible curriculum enables schools to tailor our content to their curriculum and context.",
    },
    {
      title: "Accessible",
      text: "Creating an accessible curriculum that addresses the needs of all pupils and meets accessibility guidelines and requirements.",
    },
    {
      title: "Diverse",
      text: "We prioritise creating a diverse curriculum by committing to diversity in teaching and teachers, and the language, texts and media we use, so all pupils feel positively represented.",
    },
    {
      title: "Evidence-informed",
      text: "We take an evidence-informed approach applying the science of learning and subject-specific research.",
    },
  ];

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

      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>

      <w:p>
        <w:pPr>
          <w:sectPr>
            <w:pgSz w:w="11909" w:h="16834" />
            <w:pgMar
              w:top="${cmToTwip(1.5)}"
              w:right="${cmToTwip(1.5)}"
              w:bottom="${cmToTwip(1.5)}"
              w:left="${cmToTwip(1.5)}"
              w:header="${cmToTwip(1.5)}"
              w:footer="${cmToTwip(1.5)}"
              w:gutter="0"
            />
            <w:cols w:space="708" />
            <w:docGrid w:linePitch="360" />
          </w:sectPr>
        </w:pPr>
      </w:p>
      ${points.map((point, columnIndex) => {
        return safeXml`
          <w:p>
            <w:pPr>
              <w:pStyle w:val="Heading3" />
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
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
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:color w:val="222222" />
                <w:sz w:val="24" />
              </w:rPr>
              <w:t>${cdata(point.text)}</w:t>
            </w:r>
          </w:p>
          ${columnIndex === 2 ? "" : "<w:p/>"}
        `;
      })}
      <w:p>
        <w:pPr>
          <w:sectPr>
            <w:type w:val="continuous" />
            <w:pgSz w:w="11909" w:h="16834" />
            <w:pgMar
              w:top="${cmToTwip(1.5)}"
              w:right="${cmToTwip(1.5)}"
              w:bottom="${cmToTwip(1.5)}"
              w:left="${cmToTwip(1.5)}"
              w:header="${cmToTwip(1.5)}"
              w:footer="${cmToTwip(1.5)}"
              w:gutter="0"
            />
            <w:cols w:num="2" w:space="720" />
            <w:docGrid w:linePitch="360" />
          </w:sectPr>
        </w:pPr>
      </w:p>
      <w:p>
        <w:pPr>
          <w:jc w:val="center" />
        </w:pPr>
        <w:r>
          ${createImage(images.oakCurriculum, {
            width: cmToEmu(11.01),
            height: cmToEmu(10.19),
            desc: "A bee hive diagram showing each of Oak's 6 curriculum principles",
          })}
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:sectPr>
            <w:type w:val="continuous" />
            <w:pgSz w:w="11909" w:h="16834" />
            <w:pgMar
              w:top="${cmToTwip(1.5)}"
              w:right="${cmToTwip(1.5)}"
              w:bottom="${cmToTwip(1.5)}"
              w:left="${cmToTwip(1.5)}"
              w:header="${cmToTwip(1.5)}"
              w:footer="${cmToTwip(1.5)}"
              w:gutter="0"
            />
            <w:cols w:space="708" />
            <w:docGrid w:linePitch="360" />
          </w:sectPr>
        </w:pPr>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
