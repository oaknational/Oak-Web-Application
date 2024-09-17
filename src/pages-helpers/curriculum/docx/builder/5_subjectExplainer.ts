import { join } from "path";

import { cdata, safeXml, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  insertNumbering,
  JSZipCached,
  wrapInBookmarkPoint,
} from "../docx";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { ENABLE_CYCLE_2 } from "@/utils/curriculum/constants";

type PortableTextToDocxDef = {
  list: (block: PortableTextJSON[number], content: string) => Promise<string>;
  listItem: (
    block: PortableTextJSON[number],
    content: string,
  ) => Promise<string>;
  block: Record<
    string,
    (block: PortableTextJSON[number], content: string) => Promise<string>
  >;
  marks: Record<string, (block: PortableTextJSON[number]) => Promise<string>>;
};

function rulesFromMarks(
  block: PortableTextJSON[number],
  types: PortableTextToDocxDef,
) {
  return block.marks
    .map((mark: string) => {
      return mark in types.marks ? types.marks[mark]?.(block) : "";
    })
    .join("");
}

function findListIndex(blocks: PortableTextJSON, index: number) {
  if (blocks[index].listItem) {
    let listIndex = 0;
    for (let i = index - 1; i > 0; i--) {
      if (!blocks[i].listItem) {
        break;
      }
      listIndex++;
    }
    return listIndex;
  }
  return 0;
}

async function renderItem(
  block: PortableTextJSON[number],
  types: PortableTextToDocxDef,
  { blocks, index }: { blocks: PortableTextJSON; index: number },
  content: string,
) {
  if (block._type === "span") {
    return safeXml`
      <w:r>
        <w:rPr>${rulesFromMarks(block, types)}</w:rPr>
        <w:t>${cdata(block.text)}</w:t>
      </w:r>
    `;
  } else if (block._type === "block") {
    if (block.listItem) {
      const listIndex = findListIndex(blocks, index);
      let output = "";
      if (listIndex === 0) {
        output += await types.list(block, content);
      }
      output += await types.listItem(block, content);
      return output;
    }
    const renderer =
      block.style in types.block
        ? types.block[block.style]
        : types.block.normal;
    return (await renderer?.(block, content)) ?? "";
  }
}

async function portableTextToDocx(
  blocks: PortableTextJSON[number],
  types: PortableTextToDocxDef,
) {
  if (!blocks) return "";
  let output = "";
  let index = 0;
  for (const block of blocks) {
    output += await renderItem(
      block,
      types,
      { blocks, index },
      await portableTextToDocx(block.children, types),
    );
    index++;
  }
  return output;
}

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    educationRoad: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/education-road.png",
    ),
    underline: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    ),
  });

  const curriculaDescLines = data.curriculaDesc
    .split("\n")
    .filter((line) => line !== "");

  let currentNumbering:
    | {
        bullet: string;
        numbering: string;
      }
    | undefined;

  const explainerXml = await portableTextToDocx(
    data.curriculumExplainer.explainerRaw,
    {
      list: async () => {
        currentNumbering = await insertNumbering(zip, {
          bullet: safeXml`
            <XML_FRAGMENT>
              <w:multiLevelType w:val="multilevel" />
              <w:lvl w:ilvl="0">
                <w:start w:val="1" />
                <w:numFmt w:val="bullet" />
                <w:lvlText w:val="" />
                <w:lvlJc w:val="left" />
                <w:pPr>
                  <w:tabs>
                    <w:tab w:val="num" w:pos="720" />
                  </w:tabs>
                  <w:ind w:left="720" w:hanging="720" />
                </w:pPr>
                <w:rPr>
                  <w:rFonts
                    w:ascii="Symbol"
                    w:hAnsi="Symbol"
                    w:hint="default"
                  />
                </w:rPr>
              </w:lvl>
            </XML_FRAGMENT>
          `,
          numbering: safeXml`
            <XML_FRAGMENT>
              <w:lvl w:ilvl="0">
                <w:start w:val="1" />
                <w:numFmt w:val="decimal" />
                <w:lvlText w:val="%1." />
                <w:lvlJc w:val="left" />
                <w:pPr>
                  <w:ind w:left="360" w:hanging="360" />
                </w:pPr>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                </w:rPr>
              </w:lvl>
            </XML_FRAGMENT>
          `,
        });
        return "";
      },
      listItem: async (block, content) => {
        if (!currentNumbering) {
          throw new Error("Invalid numbering");
        }
        const numId =
          block.listItem === "numbering"
            ? currentNumbering.numbering
            : currentNumbering.bullet;
        return safeXml`
          <w:p>
            <w:pPr>
              <w:numPr>
                <w:ilvl w:val="0" />
                <w:numId w:val="${numId}" />
              </w:numPr>
              <w:spacing w:line="276" w:lineRule="auto" />
              <w:ind w:left="425" w:right="-17" w:hanging="360" />
            </w:pPr>
            ${content}
          </w:p>
        `;
      },
      block: {
        normal: async (_block, content) => {
          return safeXml` <w:p>${content}</w:p> `;
        },
        heading2: async (_block, content) => {
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
                ${content}
              </w:r>
            </w:p>
          `;
        },
        heading3: async (_block, content) => {
          return safeXml`
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading4" />
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:b />
                  <w:color w:val="222222" />
                  <w:sz w:val="28" />
                </w:rPr>
                ${content}
              </w:r>
            </w:p>
          `;
        },
        heading4: async (_block, content) => {
          return safeXml`
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading5" />
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:b />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                </w:rPr>
                ${content}
              </w:r>
            </w:p>
          `;
        },
      },
      marks: {
        strong: async () => {
          return safeXml`<w:b val="1" />`;
        },
        em: async () => {
          return safeXml`<w:i val="1" />`;
        },
      },
    },
  );

  let pageXml;

  if (ENABLE_CYCLE_2) {
    pageXml = safeXml`
      <root>
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading2" />
          </w:pPr>
          ${wrapInBookmarkPoint(
            "section_curriculum_overview",
            safeXml`
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:b />
                  <w:color w:val="222222" />
                  <w:sz w:val="56" />
                </w:rPr>
                <w:t>${cdata(`${data.subjectTitle} curriculum overview`)}</w:t>
              </w:r>
            `,
          )}
        </w:p>
        ${ENABLE_CYCLE_2 ? explainerXml : ""}
      </root>
    `;
  } else {
    pageXml = safeXml`
      <root>
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading2" />
          </w:pPr>
          ${wrapInBookmarkPoint(
            "section_curriculum_overview",
            safeXml`
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:b />
                  <w:color w:val="222222" />
                  <w:sz w:val="56" />
                </w:rPr>
                <w:t>${cdata(`${data.subjectTitle} curriculum overview`)}</w:t>
              </w:r>
            `,
          )}
        </w:p>
        <w:p>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
              <w:b />
              <w:color w:val="222222" />
              <w:sz w:val="56" />
            </w:rPr>
            <w:t />
          </w:r>
        </w:p>
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
            <w:t>${cdata(`Curriculum explainer`)}</w:t>
            ${createImage(images.underline, {
              width: cmToEmu(6.97),
              height: cmToEmu(0.21),
              xPos: cmToEmu(-0.19),
              yPos: cmToEmu(0.9),
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
              <w:sz w:val="36" />
            </w:rPr>
            <w:t />
          </w:r>
        </w:p>
        ${curriculaDescLines
          .map((line) => {
            return safeXml`
              <w:p>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                    <w:color w:val="222222" />
                    <w:sz w:val="24" />
                  </w:rPr>
                  <w:t>${cdata(line)}</w:t>
                </w:r>
              </w:p>
            `;
          })
          .join("")}
      ${Array(9)
          .fill(true)
          .map(() => {
            return `<w:p />`;
          })}
        <w:p>
          <w:pPr>
            <w:jc w:val="center" />
          </w:pPr>
          <w:r>
            ${createImage(images.educationRoad, {
              width: cmToEmu(13.92),
              height: cmToEmu(10.29),
              isDecorative: true,
            })}
          </w:r>
        </w:p>
      </root>
    `;
  }

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
