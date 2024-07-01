import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";

import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
} from "./helper";

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    arrowBullet:
      "src/pages-helpers/curriculum/docx/builder/images/arrow-bullet.png",
  });

  console.log({ data });

  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading3"/>
                </w:pPr>
                <w:r>
                    <w:t>${cdata("Subject principals")}</w:t>
                </w:r>
            </w:p>
            ${data.subjectPrinciples.map((subjectPrincipal) => {
              return `
                    <w:p>
                        <w:r>
                            <w:t>${cdata(subjectPrincipal)}</w:t>
                        </w:r>
                    </w:p>
                `;
            })}
            <w:p>
                <w:r>
                    ${createImage(images.arrowBullet, {
                      width: cmToEmu(1.11),
                      height: cmToEmu(1.03),
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
