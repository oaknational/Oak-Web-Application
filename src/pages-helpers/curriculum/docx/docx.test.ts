import { Element } from "xml-js";
import { sortBy } from "lodash";

import { checkWithinElement, generateEmptyDocx, mapOverElements } from "./docx";
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
});
