import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../../xml";
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
    oglLogo: "src/pages-helpers/curriculum/docx/v2/builder/images/ogl-logo.png",
    peopleIcon:
      "src/pages-helpers/curriculum/docx/v2/builder/images/people-icon.png",
    box: "src/pages-helpers/curriculum/docx/v2/builder/images/box.png",
  });

  const pageXml = `
        <root>
            <w:p>
                <w:r>
                    <w:t>${cdata("© Oak National Academy 2024.")}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:t>${cdata(
                      `Produced in partnership with ${data.curriculumPartner.name}.`,
                    )}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:t>${cdata(
                      "Licensed on the Open Government Licence v3.0, except where otherwise stated. See Oak terms and conditions.",
                    )}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    ${createImage(images.oglLogo, {
                      width: cmToEmu(2.18),
                      height: cmToEmu(1.1),
                      isDecorative: true,
                    })}
                    ${createImage(images.peopleIcon, {
                      width: cmToEmu(9.56),
                      height: cmToEmu(13.05),
                      isDecorative: true,
                    })}
                    ${createImage(images.box, {
                      width: cmToEmu(18.26),
                      height: cmToEmu(7.49),
                      isDecorative: true,
                    })}
                </w:r>
            </w:p>
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
