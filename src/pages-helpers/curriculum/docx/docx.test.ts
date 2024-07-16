import { Element } from "xml-js";
import { sortBy } from "lodash";
import jsonDiff from "json-diff";

import {
  checkWithinElement,
  cmToEmu,
  cmToTwip,
  CURRENT_BOOKMARK,
  emuToCm,
  generateEmptyDocx,
  insertImages,
  insertNumbering,
  lineHeight,
  mapOverElements,
  pointToDxa,
  wrapInBookmarkPoint,
  wrapInLinkTo,
  wrapInLinkToBookmark,
} from "./docx";
import { zipToSimpleObject } from "./zip";

describe("docx", () => {
  describe("checkWithinElement", () => {
    const root = {
      name: "t:p",
      elements: [
        {
          name: "t:r",
          elements: [
            {
              type: "text",
              text: "one",
            },
            {
              type: "text",
              text: "two",
            },
          ],
        },
      ],
    };

    it("return true if check passes at least once", () => {
      const result = checkWithinElement(
        root,
        (node) => node.elements?.length === 2,
      );
      expect(result).toBe(true);
    });

    it("return false if check always fails", () => {
      const result = checkWithinElement(
        root,
        (node) => node.elements?.length === 3,
      );
      expect(result).toBe(false);
    });
  });

  describe("mapOverElements", () => {
    const root = {
      name: "t:p",
      elements: [
        {
          name: "t:r",
          elements: [
            {
              type: "text",
              text: "one",
            },
            {
              type: "text",
              text: "two",
            },
          ],
        },
        {
          name: "t:r",
          elements: [
            {
              type: "text",
              text: "three",
            },
            {
              type: "text",
              text: "four",
            },
          ],
        },
      ],
    };

    it("should not mutate if no changes", async () => {
      const changedRoot = await mapOverElements(root, async (node: Element) => {
        return node;
      });
      expect(changedRoot).toEqual(root);
      expect(changedRoot).toBe(root);
    });

    it("should mutate changes made", async () => {
      const changedRoot = await mapOverElements(root, async (node: Element) => {
        if (node.type === "text") {
          return {
            ...node,
            text: String(node.text).toUpperCase(),
          };
        }
        return node;
      });

      expect(changedRoot).not.toBe(root);
      expect(changedRoot).toEqual({
        name: "t:p",
        elements: [
          {
            name: "t:r",
            elements: [
              {
                type: "text",
                text: "ONE",
              },
              {
                type: "text",
                text: "TWO",
              },
            ],
          },
          {
            name: "t:r",
            elements: [
              {
                type: "text",
                text: "THREE",
              },
              {
                type: "text",
                text: "FOUR",
              },
            ],
          },
        ],
      });
    });
  });

  describe("generateEmptyDocx", () => {
    it("test", async () => {
      const zip = await generateEmptyDocx();

      const keys = Object.keys(await zipToSimpleObject(zip));
      expect(sortBy(keys)).toEqual(
        sortBy([
          "word/",
          "docProps/",
          "_rels/",
          "[Content_Types].xml",
          "word/webSettings.xml",
          "word/styles.xml",
          "word/settings.xml",
          "word/fontTable.xml",
          "word/document.xml",
          "word/_rels/",
          "docProps/core.xml",
          "docProps/app.xml",
          "_rels/.rels",
          "word/_rels/document.xml.rels",
        ]),
      );
    });
  });

  const EMPTY_PNG_BASE64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABgAAAAAQAAAGAAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAAAWgAwAEAAAAAQAAAAUAAAAAY82dNQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KGV7hBwAAAAxJREFUCB1jYKATAAAAaQABgxuGDAAAAABJRU5ErkJggg==";

  describe("insertImages", () => {
    it("test", async () => {
      const zip = await generateEmptyDocx();

      const EMPTY_PNG = `data:image/png;base64,${EMPTY_PNG_BASE64}`;
      const initialState = await zipToSimpleObject(zip, {
        convertXmlToJson: true,
      });
      await insertImages(zip, {
        foobar: EMPTY_PNG,
      });
      const newState = await zipToSimpleObject(zip, { convertXmlToJson: true });

      const diffResults = jsonDiff.diff(initialState, newState);
      expect(Object.keys(diffResults)).toEqual([
        "word/media/__added",
        "word/media/hash_9cfc90df07d91d4dc758241ab56c592936ba10fepng__added",
        "word/_rels/document.xml.rels",
      ]);

      expect(diffResults["word/media/__added"]).toEqual("");
      // expect(diffResults["word/media/hash_9cfc90df07d91d4dc758241ab56c592936ba10fepng__added"]).toEqual(Buffer.from(EMPTY_PNG, "base64"))
      expect(diffResults["word/_rels/document.xml.rels"]).toEqual({
        elements: [
          [
            "~",
            {
              elements: [
                [" "],
                [" "],
                [" "],
                [" "],
                [
                  "+",
                  {
                    type: "element",
                    name: "Relationship",
                    attributes: {
                      Id: "rId9cfc90df07d91d4dc758241ab56c592936ba10fe",
                      Type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
                      Target:
                        "media/hash_9cfc90df07d91d4dc758241ab56c592936ba10fepng",
                    },
                  },
                ],
              ],
            },
          ],
        ],
      });
    });
  });

  describe("insertNumbering", () => {
    it.skip("test", async () => {
      const zip = await generateEmptyDocx();

      const initialState = await zipToSimpleObject(zip, {
        convertXmlToJson: true,
      });

      await insertNumbering(zip, {
        lessonNumbering: `
          <XML_FRAGMENT>
            <w:nsid w:val="099A081C" />
            <w:multiLevelType w:val="hybridMultilevel" />
            <w:lvl w:ilvl="0">
              <w:start w:val="1" />
              <w:numFmt w:val="upperLetter" />
              <w:lvlText w:val="%1." />
              <w:lvlJc w:val="start" />
              <w:pPr>
                <w:ind w:start="360" w:hanging="360" />
              </w:pPr>
              <w:rPr>
                <w:rFonts w:ascii="Arial Black" w:hAnsi="Arial Black" />
                <w:color w:val="C00000" />
                <w:sz w:val="28" />
              </w:rPr>
            </w:lvl>
          </XML_FRAGMENT>
        `,
      });

      await insertNumbering(zip, {
        lessonNumbering: `
          <XML_FRAGMENT>
            <w:nsid w:val="099A081C" />
            <w:multiLevelType w:val="hybridMultilevel" />
            <w:lvl w:ilvl="0">
              <w:start w:val="1" />
              <w:numFmt w:val="upperLetter" />
              <w:lvlText w:val="%1." />
              <w:lvlJc w:val="start" />
              <w:pPr>
                <w:ind w:start="360" w:hanging="360" />
              </w:pPr>
              <w:rPr>
                <w:rFonts w:ascii="Arial Black" w:hAnsi="Arial Black" />
                <w:color w:val="C00000" />
                <w:sz w:val="28" />
              </w:rPr>
            </w:lvl>
          </XML_FRAGMENT>
        `,
      });

      const newState = await zipToSimpleObject(zip, { convertXmlToJson: true });
      const diffResults = jsonDiff.diff(initialState, newState);
      console.log({ diffResults });
    });
  });

  test("cmToEmu", () => {
    expect(cmToEmu(1)).toEqual(360000);
  });

  test("emuToCm", () => {
    expect(emuToCm(360000)).toEqual(1);
  });

  test("lineHeight", () => {
    expect(lineHeight(12, 1.15)).toEqual(276);
  });

  test("pointToDxa", () => {
    expect(pointToDxa(12)).toEqual(240);
  });

  test("cmToTwip", () => {
    expect(cmToTwip(1)).toEqual(567);
  });

  test("wrapInLinkTo", () => {
    expect(wrapInLinkTo("rId1", "Testing")).toEqual(
      `<w:hyperlink r:id="rId1">Testing</w:hyperlink>`,
    );
  });

  test("wrapInLinkToBookmark", () => {
    expect(wrapInLinkToBookmark("foobar", "Testing")).toEqual(
      `<w:hyperlink w:anchor="foobar">Testing</w:hyperlink>`,
    );
  });

  test("wrapInBookmarkPoint", () => {
    expect(wrapInBookmarkPoint("testing", "<w:p/>")).toEqual(
      `<w:bookmarkStart w:id="${CURRENT_BOOKMARK.id}" w:name="testing"/><w:p/><w:bookmarkEnd w:id="${CURRENT_BOOKMARK.id}"/>`,
    );
  });
});
