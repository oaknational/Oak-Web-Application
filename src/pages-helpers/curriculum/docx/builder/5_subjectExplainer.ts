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
  line240,
  wrapInBookmarkPoint,
} from "../docx";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { isCycleTwoEnabled } from "@/utils/curriculum/features";

type PortableTextToDocxDef = {
  list: (
    block: PortableTextJSON[number],
    content: string,
    previousBlock?: PortableTextJSON[number],
  ) => Promise<string>;
  listItem: (
    block: PortableTextJSON[number],
    content: string,
    previousBlock?: PortableTextJSON[number],
  ) => Promise<string>;
  block: Record<
    string,
    (
      block: PortableTextJSON[number],
      content: string,
      previousBlock?: PortableTextJSON[number],
    ) => Promise<string>
  >;
  blockStyling: Record<string, (block: PortableTextJSON[number]) => string>;
  marks: Record<string, (block: PortableTextJSON[number]) => Promise<string>>;
};

function rulesFromMarks(
  block: PortableTextJSON[number],
  types: PortableTextToDocxDef,
  parent?: PortableTextJSON[number],
) {
  const rules = block.marks.map((mark: string) => {
    return mark in types.marks ? types.marks[mark]?.(block) : "";
  });
  if (types.blockStyling[parent?.style]) {
    rules.push(types.blockStyling[parent?.style]?.(block));
  }
  return rules.join("");
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
  parent?: PortableTextJSON[number],
) {
  if (block._type === "span") {
    return safeXml`
      <w:r>
        <w:rPr>${rulesFromMarks(block, types, parent)}</w:rPr>
        <w:t>${cdata(block.text)}</w:t>
      </w:r>
    `;
  } else if (block._type === "block") {
    const previousBlock = blocks[index - 1];
    if (block.listItem) {
      const listIndex = findListIndex(blocks, index);
      let output = "";
      if (listIndex === 0) {
        output += await types.list(block, content, previousBlock);
      }
      output += await types.listItem(block, content, previousBlock);
      return output;
    }
    const renderer =
      block.style in types.block
        ? types.block[block.style]
        : types.block.normal;
    return (await renderer?.(block, content, previousBlock)) ?? "";
  }
}

async function portableTextToDocx(
  blocks: PortableTextJSON[number],
  types: PortableTextToDocxDef,
  parent?: PortableTextJSON[number],
) {
  if (!blocks) return "";
  let output = "";
  let index = 0;
  for (const block of blocks) {
    output += await renderItem(
      block,
      types,
      { blocks, index },
      await portableTextToDocx(block.children, types, block),
      parent,
    );
    index++;
  }
  return output;
}

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const cycleTwoEnabled = isCycleTwoEnabled();
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
                  <w:ind w:left="425" w:right="-50" w:hanging="360" />
                </w:pPr>
                <w:rPr>
                  <w:rFonts
                    w:ascii="Symbol"
                    w:hAnsi="Symbol"
                    w:hint="default"
                  />
                </w:rPr>
              </w:lvl>
              <w:lvl w:ilvl="1">
                <w:start w:val="1" />
                <w:numFmt w:val="bullet" />
                <w:lvlText w:val="" />
                <w:lvlJc w:val="left" />
                <w:pPr>
                  <w:tabs>
                    <w:tab w:val="num" w:pos="1440" />
                  </w:tabs>
                  <w:ind w:left="850" w:right="-50" w:hanging="360" />
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
                  <w:ind w:left="425" w:right="-17" w:hanging="360" />
                </w:pPr>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                </w:rPr>
              </w:lvl>
              <w:lvl w:ilvl="1">
                <w:start w:val="1" />
                <w:numFmt w:val="decimal" />
                <w:lvlText w:val="%1." />
                <w:lvlJc w:val="left" />
                <w:pPr>
                  <w:ind w:left="850" w:right="-17" w:hanging="360" />
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
                <w:ilvl w:val="${block.level - 1}" />
                <w:numId w:val="${numId}" />
              </w:numPr>
              <w:spacing w:line="276" w:lineRule="auto" w:line="240" />
            </w:pPr>
            ${content}
          </w:p>
        `;
      },
      block: {
        normal: async (_block, content, previousBlock) => {
          const numberOfEmptyLinesBefore =
            previousBlock?.style === "normal" ? 1 : 0;
          return safeXml`
            <w:p>
              <w:pPr>
                <w:spacing
                  w:lineRule="auto"
                  w:line="240"
                  w:before="${line240(numberOfEmptyLinesBefore)}"
                  w:after="${line240(0)}"
                />
              </w:pPr>
              ${content}
            </w:p>
          `;
        },
        heading1: async (_block, content, previousBlock) => {
          const numberOfEmptyLinesBefore =
            previousBlock?.style === "normal" ? 3 : 0;
          return safeXml`
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading3" />
                <w:keepNext />
                <w:spacing
                  w:lineRule="auto"
                  w:line="240"
                  w:before="${line240(numberOfEmptyLinesBefore)}"
                  w:after="${line240(0.5)}"
                />
              </w:pPr>
              ${content}
            </w:p>
          `;
        },
        heading2: async (_block, content, previousBlock) => {
          const numberOfEmptyLinesBefore =
            previousBlock?.style === "normal" ? 2 : 0;
          return safeXml`
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading4" />
                <w:keepNext />
                <w:spacing
                  w:lineRule="auto"
                  w:line="240"
                  w:before="${line240(numberOfEmptyLinesBefore)}"
                  w:after="${line240(0.8)}"
                />
              </w:pPr>
              ${content}
            </w:p>
          `;
        },
        heading3: async (_block, content, previousBlock) => {
          let numberOfEmptyLinesBefore =
            previousBlock?.style === "normal" ? 1 : 0;
          numberOfEmptyLinesBefore =
            previousBlock?.style === "heading2" ? 1 : numberOfEmptyLinesBefore;

          return safeXml`
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading5" />
                <w:keepNext />
                <w:spacing
                  w:lineRule="auto"
                  w:line="240"
                  w:before="${line240(numberOfEmptyLinesBefore)}"
                  w:after="${line240(0.8)}"
                />
              </w:pPr>
              ${content}
            </w:p>
          `;
        },
        heading4: async (_block, content) => {
          return safeXml`
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading6" />
                <w:keepNext />
                <w:spacing
                  w:lineRule="auto"
                  w:line="240"
                  w:before="0"
                  w:after="${line240(1)}"
                  w:beforeAutospacing="${line240(0.2)}"
                />
              </w:pPr>
              ${content}
            </w:p>
          `;
        },
      },
      blockStyling: {
        heading1: () => {
          return safeXml`
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b />
            <w:i w:val="0" />
            <w:color w:val="222222" />
            <w:sz w:val="36" />
          `;
        },
        heading2: () => {
          return safeXml`
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b />
            <w:i w:val="0" />
            <w:color w:val="222222" />
            <w:sz w:val="28" />
          `;
        },
        heading3: () => {
          return safeXml`
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b />
            <w:i w:val="0" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          `;
        },
        heading4: () => {
          return safeXml`
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b />
            <w:i w:val="0" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
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

  if (cycleTwoEnabled) {
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
        <w:p />
        <w:p />
        ${cycleTwoEnabled ? explainerXml : ""}
        ${Array(4)
          .fill(true)
          .map(() => safeXml`<w:p />`)}
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
