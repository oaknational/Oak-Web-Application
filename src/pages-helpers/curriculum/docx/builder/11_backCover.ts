import { join } from "path";

import type JSZip from "jszip";

import { cdata, safeXml, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
} from "../docx";

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    oglLogo: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/ogl-logo.png",
    ),
    peopleIcon: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/people-icon.png",
    ),
    box: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/box.png",
    ),
  });

  const pageXml = safeXml`
    <root>
      ${Array(20)
        .fill(true)
        .map(() => {
          return safeXml`
            <w:p>
              <w:r>
                <w:t />
              </w:r>
            </w:p>
          `;
        })
        .join("")}
      <w:p>
        <w:r>
          <w:t>${cdata("© Oak National Academy 2024.")}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:t>
            ${cdata(
              `Produced in partnership with ${data.curriculumPartner.name}.`,
            )}
          </w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:t>
            ${cdata(
              "Licensed on the Open Government Licence v3.0, except where otherwise stated. See Oak terms and conditions.",
            )}
          </w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          ${createImage(images.box, {
            width: cmToEmu(18.26),
            height: cmToEmu(7.49),
            xPos: cmToEmu(1.38),
            yPos: cmToEmu(18.14),
            isDecorative: true,
          })}
                    ${createImage(images.oglLogo, {
            width: cmToEmu(2.18),
            height: cmToEmu(1.1),
            xPos: cmToEmu(16.29),
            yPos: cmToEmu(22.96),
            isDecorative: true,
          })}
                    ${createImage(images.peopleIcon, {
            width: cmToEmu(9.56),
            height: cmToEmu(13.05),
            xPos: cmToEmu(5.63),
            yPos: cmToEmu(3.27),
            isDecorative: true,
          })}
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
