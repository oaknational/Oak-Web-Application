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
  insertLinks,
  wrapInLinkTo,
} from "../docx";

import { getPortableTextTypes, portableTextToDocx } from "./portableText";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { CombinedCurriculumData } from "@/utils/curriculum/types";

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    // oglLogo: join(
    //   process.cwd(),
    //   "src/pages-helpers/curriculum/docx/builder/images/ogl-logo.png",
    // ),
    peopleIcon: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/people-icon.png",
    ),
    box: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/box-with-logo.png",
    ),
    jumpOutArrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/jump-out-arrow-2.png",
    ),
  });

  const links = await insertLinks(zip, {
    ogl: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
    terms: "https://www.thenational.academy/legal/terms-and-conditions",
  });

  function joinPortableTextWords(words: PortableTextJSON) {
    const out: PortableTextJSON = [];
    words.forEach((block, index) => {
      out.push(block);
      if (index < words.length - 1) {
        if (index === words.length - 2) {
          out.push({
            _type: "span",
            marks: [],
            text: " and ",
          });
        } else {
          out.push({
            _type: "span",
            marks: [],
            text: ", ",
          });
        }
      }
    });
    return out;
  }

  const curriculumPartnerWords = data.curriculumPartnerOverviews.map(
    (partner) => {
      return {
        _type: "span",
        marks: [],
        text: partner.curriculumPartner.name,
      };
    },
  );
  const curriculumPartnerText = await portableTextToDocx(
    joinPortableTextWords(curriculumPartnerWords),
    getPortableTextTypes(zip),
  );

  const pageXml = safeXml`
    <root>
      ${Array(2)
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
          <w:jc w:val="center" />
        </w:pPr>
        <w:r>
          ${createImage(images.peopleIcon, {
            width: cmToEmu(9.56),
            height: cmToEmu(13.05),
            // xPos: cmToEmu(5.63),
            // yPos: cmToEmu(3.27),
            isDecorative: true,
          })}
        </w:r>
      </w:p>
      ${Array(3)
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
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          ${createImage(images.box, {
            width: cmToEmu(18.26),
            height: cmToEmu(7.49),
            xPos: cmToEmu(-0.02),
            yPos: cmToEmu(-0.02),
            xPosAnchor: "column",
            yPosAnchor: "paragraph",
            isDecorative: true,
          })}
        </w:r>
      </w:p>
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
      <w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>${cdata("© Oak National Academy 2024.")}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t xml:space="preserve">${cdata(
              `Produced in partnership with `,
            )}</w:t>
        </w:r>
        ${curriculumPartnerText}
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>${cdata(`.`)}</w:t>
        </w:r>
      </w:p>
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
      <w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t xml:space="preserve">Licensed on the </w:t>
        </w:r>
        ${wrapInLinkTo(
          links.ogl,
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="24" />
                <w:u w:val="single" />
              </w:rPr>
              <w:t>Open Government Licence v3.0</w:t>
            </w:r>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="24" />
                <w:u w:val="none" />
              </w:rPr>
              ${createImage(images.jumpOutArrow, {
                width: cmToEmu(0.41),
                height: cmToEmu(0.35),
                isDecorative: true,
              })}
            </w:r>
          `,
        )}
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t xml:space="preserve">, except where otherwise stated. See </w:t>
        </w:r>
        ${wrapInLinkTo(
          links.terms,
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="24" />
                <w:u w:val="single" />
              </w:rPr>
              <w:t>Oak terms and conditions</w:t>
            </w:r>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="24" />
                <w:u w:val="none" />
              </w:rPr>
              ${createImage(images.jumpOutArrow, {
                width: cmToEmu(0.41),
                height: cmToEmu(0.35),
                isDecorative: true,
              })}
            </w:r>
          `,
        )}
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>.</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:t />
        </w:r>
      </w:p>
      ${
        "" /*<w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
          <w:jc w:val="right" />
        </w:pPr>
        <w:r>
          ${createImage(images.oglLogo, {
            width: cmToEmu(2.18),
            height: cmToEmu(1.1),
            isDecorative: true,
          })}
        </w:r>
      </w:p>*/
      }
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
