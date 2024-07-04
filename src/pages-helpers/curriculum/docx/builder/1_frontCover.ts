import { join } from "path";

import type JSZip from "jszip";

import { CombinedCurriculumData } from "..";
import { cdata, xmlElementToJson } from "../xml";
import icons from "../../../../image-data/generated/subject-icons.json";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
} from "../docx";

function keyStageFromPhaseTitle(phaseTitle: string) {
  if (phaseTitle === "Primary") {
    return "KS1 & KS2";
  } else if (phaseTitle === "Secondary") {
    return "KS3 & KS4";
  }
  return phaseTitle;
}

function getSubjectIcon(iconKey: string) {
  if (iconKey in icons) {
    // @ts-expect-error: this is not type-safe right now (FIXME)
    return icons[iconKey].url;
  } else {
    return join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/icon.png",
    );
  }
}

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const iconKey = data.subjectTitle.toLowerCase();
  const images = await insertImages(zip, {
    icon: getSubjectIcon(iconKey),
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

  const pageXml = `
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
                return `
                <w:p>
                    <w:r>
                        <w:rPr>
                          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                          <w:color w:val="222222"/>
                          <w:sz w:val="24"/>
                        </w:rPr>
                        <w:t> </w:t>
                    </w:r>
                </w:p>
              `;
              })
              .join("")}
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading1"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                      <w:color w:val="222222"/>
                      <w:sz w:val="80"/>
                      <w:b/>
                    </w:rPr>
                    <w:t>${cdata(subjectTitle)}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:rPr>
                      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                      <w:color w:val="222222"/>
                      <w:sz w:val="30"/>
                    </w:rPr>
                    <w:t>${cdata(phaseTitle)}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:rPr>
                      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                      <w:color w:val="222222"/>
                      <w:sz w:val="30"/>
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
                    <w:br w:type="page"/>
                </w:r>
            </w:p>
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
