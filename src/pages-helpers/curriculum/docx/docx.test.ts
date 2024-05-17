import { Element } from "xml-js";

import {
  checkWithinElement,
  hasEndBlock,
  hasStartBlock,
  mapOverElements,
  pipeElementThrough,
  withBlock,
} from "./docx";
import { jsonXmlToXmlString } from "./xml";

describe("docx", () => {
  describe("hasStartBlock", () => {
    it("includes node", () => {
      const node = {
        name: "t:r",
        elements: [
          {
            type: "text",
            text: " {{BLOCK_START.FOOBAR}} ",
          },
        ],
      };
      expect(hasStartBlock(node, "FOOBAR")).toBe(true);
    });

    it("does not include node", () => {
      const node = {
        name: "t:r",
        elements: [
          {
            type: "text",
            text: " {{BLOCK_START.HELLO}} ",
          },
        ],
      };
      expect(hasStartBlock(node, "FOOBAR")).toBe(false);
    });
  });

  describe("hasEndBlock", () => {
    it("includes node", () => {
      const node = {
        name: "t:r",
        elements: [
          {
            type: "text",
            text: " {{BLOCK_END.FOOBAR}} ",
          },
        ],
      };
      expect(hasEndBlock(node, "FOOBAR")).toBe(true);
    });

    it("does not include node", () => {
      const node = {
        name: "t:r",
        elements: [
          {
            type: "text",
            text: " {{BLOCK_END.HELLO}} ",
          },
        ],
      };
      expect(hasEndBlock(node, "FOOBAR")).toBe(false);
    });
  });

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

  describe("pipeElementThrough", () => {
    const root = {
      name: "t:p",
      elements: [],
    };

    it("should pipe value through functions in list", async () => {
      const mock1 = jest
        .fn()
        .mockImplementation((el) => ({ ...el, name: el.name + "_one" }));
      const mock2 = jest
        .fn()
        .mockImplementation((el) => ({ ...el, name: el.name + "_two" }));
      const output = await pipeElementThrough(root, undefined, [mock1, mock2]);
      expect(output).toEqual({
        name: "t:p_one_two",
        elements: [],
      });
    });

    it("throw in function should halt", async () => {
      const mock1 = jest.fn().mockImplementation((el) => el);
      const mock2 = jest.fn().mockImplementation(() => Promise.reject("oops"));
      expect(() => {
        return pipeElementThrough(root, undefined, [mock1, mock2]);
      }).rejects.toEqual("oops");
    });
  });

  describe("withBlock", () => {
    const beforeBlockNode = {
      type: "element",
      name: "t:p",
      elements: [
        {
          type: "element",
          name: "t:r",
          elements: [
            {
              type: "text",
              text: "--BEFORE--",
            },
          ],
        },
      ],
    };
    const afterBlockNode = {
      type: "element",
      name: "t:p",
      elements: [
        {
          type: "element",
          name: "t:r",
          elements: [
            {
              type: "text",
              text: "--AFTER--",
            },
          ],
        },
      ],
    };
    const startBlockNode = {
      type: "element",
      name: "t:p",
      elements: [
        {
          type: "element",
          name: "t:r",
          elements: [
            {
              type: "text",
              text: " {{BLOCK_START.MY_BLOCK}} ",
            },
          ],
        },
      ],
    };
    const endBlockNode = {
      type: "element",
      name: "t:p",
      elements: [
        {
          type: "element",
          name: "t:r",
          elements: [
            {
              type: "text",
              text: " {{BLOCK_END.MY_BLOCK}} ",
            },
          ],
        },
      ],
    };
    const contentsNodes = [
      {
        type: "element",
        name: "t:p",
        elements: [
          {
            type: "element",
            name: "t:r",
            elements: [
              {
                type: "text",
                text: "HELLO",
              },
            ],
          },
        ],
      },
      {
        type: "element",
        name: "t:p",
        elements: [
          {
            type: "element",
            name: "t:r",
            elements: [
              {
                type: "text",
                text: " WORLD",
              },
            ],
          },
        ],
      },
    ];
    const root = {
      elements: [
        {
          name: "w:body",
          type: "element",
          elements: [
            beforeBlockNode,
            startBlockNode,
            ...contentsNodes,
            endBlockNode,
            afterBlockNode,
          ],
        },
      ],
    };

    it("deletes nodes if nothing returned", async () => {
      const fn = jest.fn().mockImplementation(() => undefined);
      const output = await withBlock(root, "MY_BLOCK", fn);
      expect(fn).toHaveBeenCalledWith({
        type: "element",
        name: "$FRAGMENT$",
        elements: contentsNodes,
      });
      expect(output).toEqual({
        elements: [
          {
            type: "element",
            name: "w:body",
            elements: [beforeBlockNode, afterBlockNode],
          },
        ],
      });
    });

    it("does not mutate inner when returning same object", async () => {
      const fn = jest.fn().mockImplementation((fragment) => fragment);
      const output = await withBlock(root, "MY_BLOCK", fn);
      expect(fn).toHaveBeenCalledWith({
        type: "element",
        name: "$FRAGMENT$",
        elements: contentsNodes,
      });
      expect(output).toEqual({
        elements: [
          {
            type: "element",
            name: "w:body",
            elements: [beforeBlockNode, ...contentsNodes, afterBlockNode],
          },
        ],
      });
      expect(jsonXmlToXmlString(output)).toEqual(
        "<w:body><t:p><t:r>--BEFORE--</t:r></t:p><t:p><t:r>HELLO</t:r></t:p><t:p><t:r> WORLD</t:r></t:p><t:p><t:r>--AFTER--</t:r></t:p></w:body>",
      );
    });

    it("does mutate when returning different object", async () => {
      const fn = jest.fn().mockImplementation(() => {
        return {
          type: "element",
          name: "$FRAGMENT$",
          elements: [
            {
              type: "text",
              text: "HELLO",
            },
            {
              type: "text",
              text: " WORLD",
            },
          ],
        };
      });
      const output = await withBlock(root, "MY_BLOCK", fn);
      expect(fn).toHaveBeenCalledWith({
        type: "element",
        name: "$FRAGMENT$",
        elements: contentsNodes,
      });

      expect(output).toEqual({
        elements: [
          {
            type: "element",
            name: "w:body",
            elements: [
              beforeBlockNode,
              {
                type: "text",
                text: "HELLO",
              },
              {
                type: "text",
                text: " WORLD",
              },
              afterBlockNode,
            ],
          },
        ],
      });
      expect(jsonXmlToXmlString(output)).toEqual(
        "<w:body><t:p><t:r>--BEFORE--</t:r></t:p>HELLO WORLD<t:p><t:r>--AFTER--</t:r></t:p></w:body>",
      );
    });

    it("returning non-fragment", async () => {
      const fn = jest.fn().mockImplementation(() => {
        return {
          type: "text",
          text: "JUST_TEXT",
        };
      });
      const output = await withBlock(root, "MY_BLOCK", fn);
      expect(fn).toHaveBeenCalledWith({
        type: "element",
        name: "$FRAGMENT$",
        elements: contentsNodes,
      });
      expect(output).toEqual({
        elements: [
          {
            type: "element",
            name: "w:body",
            elements: [
              beforeBlockNode,
              {
                type: "text",
                text: "JUST_TEXT",
              },
              afterBlockNode,
            ],
          },
        ],
      });
      expect(jsonXmlToXmlString(output)).toEqual(
        "<w:body><t:p><t:r>--BEFORE--</t:r></t:p>JUST_TEXT<t:p><t:r>--AFTER--</t:r></t:p></w:body>",
      );
    });
  });
});
