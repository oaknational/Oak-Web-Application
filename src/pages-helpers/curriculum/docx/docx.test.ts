import { Element } from "xml-js";
import { sortBy } from "lodash";

import {
  checkWithinElement,
  cmToEmu,
  cmToTwip,
  CURRENT_BOOKMARK,
  emuToCm,
  generateEmptyDocx,
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
