import { Element } from "xml-js";
import { sortBy } from "lodash";
import diff from "microdiff";

import {
  appendBodyElements,
  checkWithinElement,
  cmToEmu,
  cmToTwip,
  createImage,
  CURRENT_BOOKMARK,
  degreeToOoxmlDegree,
  emuToCm,
  generateEmptyDocx,
  getFooterFilenameFromContent,
  insertImages,
  insertLinks,
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

      const keys = Object.keys(await zipToSimpleObject(zip.getJsZip()));
      expect(sortBy(keys)).toEqual(
        sortBy([
          "word/",
          "docProps/",
          "_rels/",
          "[Content_Types].xml",
          "word/webSettings.xml",
          "word/styles.xml",
          "word/settings.xml",
          "word/endnotes.xml",
          "word/fontTable.xml",
          "word/footnotes.xml",
          "word/numbering.xml",
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
      const EMPTY_INVALID = `data:image/foo;base64,${EMPTY_PNG_BASE64}`;
      const initialState = await zipToSimpleObject(zip.getJsZip(), {
        convertXmlToJson: true,
        hashBuffers: true,
      });
      const dict = await insertImages(zip, {
        foo: EMPTY_PNG,
        bar: EMPTY_PNG,
        baz: EMPTY_INVALID,
      });
      expect(dict).toEqual({
        bar: "rIdf1c6d68f4906606ef3ae58fac887d210ae8b33ce7275c21ee8e177090278e249",
        baz: "rIdb29edb1ad79e3ac505ac9e6722aed45100902e97fd45f474aacb455a7b8d809f",
        foo: "rIdf1c6d68f4906606ef3ae58fac887d210ae8b33ce7275c21ee8e177090278e249",
      });
      const newState = await zipToSimpleObject(zip.getJsZip(), {
        convertXmlToJson: true,
        hashBuffers: true,
      });

      const diffResults = diff(initialState, newState, {});
      expect(diffResults).toMatchSnapshot();
    });
  });

  describe("insertLinks", () => {
    it("test", async () => {
      const zip = await generateEmptyDocx();

      const initialState = await zipToSimpleObject(zip.getJsZip(), {
        convertXmlToJson: true,
      });
      await insertLinks(zip, {
        foobar: "http://example.com",
        baz: "http://example.com",
      });
      const newState = await zipToSimpleObject(zip.getJsZip(), {
        convertXmlToJson: true,
      });

      const diffResults = diff(initialState, newState);

      expect(diffResults).toEqual([
        {
          path: ["word/_rels/document.xml.rels", "elements", 0, "elements", 7],
          type: "CREATE",
          value: {
            attributes: {
              Id: "rIdf0e6a6a97042a4f1f1c87f5f7d44315b2d852c2df5c7991cc66241bf7072d1c4",
              Target: "http://example.com",
              TargetMode: "External",
              Type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
            },
            name: "Relationship",
            type: "element",
          },
        },
      ]);
    });
  });

  describe("insertNumbering", () => {
    it("test", async () => {
      const zip = await generateEmptyDocx();

      const initialState = await zipToSimpleObject(zip.getJsZip(), {
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

      const newState = await zipToSimpleObject(zip.getJsZip(), {
        convertXmlToJson: true,
      });
      const diffResults = diff(initialState, newState);
      expect(diffResults).toMatchSnapshot();
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

  describe("appendBodyElements", () => {
    test("invalid", async () => {
      const zip = await generateEmptyDocx();
      zip.getJsZip().remove("word/document.xml");
      await expect(
        appendBodyElements(zip, [{ type: "text", text: "test" }]),
      ).rejects.toThrow();
    });
    test("empty", async () => {
      const zip = await generateEmptyDocx();
      const initialState = await zipToSimpleObject(zip.getJsZip(), {
        convertXmlToJson: true,
      });
      appendBodyElements(zip);
      const newState = await zipToSimpleObject(zip.getJsZip(), {
        convertXmlToJson: true,
      });
      expect(initialState).toEqual(newState);
    });
    test("valid", async () => {
      const zip = await generateEmptyDocx();
      const initialState = await zipToSimpleObject(zip.getJsZip(), {
        convertXmlToJson: true,
      });
      await appendBodyElements(zip, [{ type: "text", text: "test" }]);

      const newState = await zipToSimpleObject(zip.getJsZip(), {
        convertXmlToJson: true,
      });
      const diffResults = diff(initialState, newState);

      expect(diffResults).toEqual([
        {
          path: [
            "word/document.xml",
            "elements",
            0,
            "elements",
            0,
            "elements",
            1,
          ],
          type: "CREATE",
          value: { text: "test", type: "text" },
        },
      ]);
    });
  });

  test("getFooterFilenameFromContent", () => {
    expect(getFooterFilenameFromContent("test")).toEqual(
      "footer-9f86d081884c.xml",
    );
  });

  test("degreeToOoxmlDegree", () => {
    expect(degreeToOoxmlDegree(30)).toEqual(1800000);
    expect(degreeToOoxmlDegree(0)).toEqual(0);
    expect(degreeToOoxmlDegree(360)).toEqual(21600000);
    expect(degreeToOoxmlDegree(440)).toEqual(26400000);
  });

  describe("createImage", () => {
    test("no options", () => {
      expect(createImage("r32")).toMatchSnapshot();
    });
    test("all options", () => {
      expect(
        createImage("r32", {
          name: "test",
          desc: "testing",
          width: 100,
          height: 101,
          xPos: 102,
          yPos: 103,
          xPosAnchor: "column",
          yPosAnchor: "column",
          isDecorative: true,
          isWrapTight: true,
          relativeHeight: 2,
          rotation: 30,
        }),
      ).toMatchSnapshot();
    });
  });
});
