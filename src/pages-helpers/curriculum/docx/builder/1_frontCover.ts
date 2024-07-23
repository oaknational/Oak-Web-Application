import { join } from "path";

import type JSZip from "jszip";

import { CombinedCurriculumData } from "..";
import { cdata, safeXml, xmlElementToJson } from "../xml";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
} from "../docx";

import {
  cmToPxDpi,
  keyStageFromPhaseTitle,
  makeTransparentIfSanity,
} from "./helper";

import { getSubjectIconAsset } from "@/image-data";

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const iconKey = data.subjectTitle.toLowerCase();

  const sanityUrl = getSubjectIconAsset(iconKey)?.url;
  const images = await insertImages(zip, {
    icon: sanityUrl
      ? makeTransparentIfSanity(sanityUrl, cmToPxDpi(13))
      : join(
          process.cwd(),
          "src/pages-helpers/curriculum/docx/builder/images/icon.png",
        ),
    arrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/arrow.png",
    ),
    logo: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/logo.png",
    ),
  });

  const phaseTitle = keyStageFromPhaseTitle(data.phaseTitle);
  const subjectTitle = data.subjectTitle;
  const examboardTitle = data.examboardTitle
    ? `${data.examboardTitle} (KS4)`
    : "";

  const pageXml = safeXml`
    <root>
      <w:p>
        <w:r>
          ${createImage(images.logo, {
            width: cmToEmu(4.36),
            height: cmToEmu(2),
            desc: "Oak National Academy logo",
          })}
        </w:r>
      </w:p>
      ${Array(6)
        .fill(true)
        .map(() => {
          return safeXml`
            <w:p>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                </w:rPr>
                <w:t />
              </w:r>
            </w:p>
          `;
        })
        .join("")}
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading1" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b w:val="true" />
            <w:color w:val="222222" />
            <w:sz w:val="80" />
          </w:rPr>
          <w:t>${cdata(`${phaseTitle} ${subjectTitle} curriculum plan`)}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="30" />
          </w:rPr>
          <w:t>${cdata(examboardTitle)}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          ${createImage(images.arrow, {
            width: cmToEmu(20.54),
            height: cmToEmu(15.18),
            xPos: cmToEmu(0.25),
            yPos: cmToEmu(13.13),
            isDecorative: true,
          })}
                    ${createImage(images.icon, {
            width: cmToEmu(12.59),
            height: cmToEmu(12.59),
            xPos: cmToEmu(7.92),
            yPos: cmToEmu(13.11),
            isDecorative: true,
          })}
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
