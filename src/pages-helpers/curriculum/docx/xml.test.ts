import {
  cdata,
  cdataJson,
  collapseFragments,
  createFragment,
  jsonXmlToXmlString,
  safeXml,
  xmlCompact,
  xmlElementToJson,
  xmlRootToJson,
} from "./xml";

describe("xml", () => {
  describe("xmlElementToJson", () => {
    it("should succeed with valid XML with single root node", () => {
      const json = xmlElementToJson(`<one>
                <two></two>
            </one>`);
      expect(json).toEqual({
        type: "element",
        name: "one",
        elements: [
          {
            type: "element",
            name: "two",
          },
        ],
      });
    });

    it("should return empty if empty", () => {
      const json = xmlElementToJson(undefined);
      expect(json).toEqual(undefined);
    });

    it("should throw with valid XML with multiple root nodes", () => {
      expect(() => {
        xmlElementToJson(`
                    <one></one>
                    <two></two>
                `);
      }).toThrow();
    });

    it("should throw with invalid XML", () => {
      expect(() => {
        xmlElementToJson(`
                    <one></two>
                `);
      }).toThrow();
    });
  });

  describe("xmlRootToJson", () => {
    it("should succeed with valid XML with single root node", () => {
      const root = xmlRootToJson(`<one>
                <two></two>
            </one>`);
      expect(root.elements).toEqual([
        {
          type: "element",
          name: "one",
          elements: [
            {
              type: "element",
              name: "two",
            },
          ],
        },
      ]);
    });

    it("should succeed with valid XML with multiple root nodes", () => {
      const root = xmlRootToJson(`
                    <one></one>
                    <two></two>
            `);
      expect(root.elements).toEqual([
        { type: "element", name: "one" },
        { type: "element", name: "two" },
      ]);
    });

    it("should throw with invalid XML", () => {
      expect(() => {
        xmlRootToJson(`
                    <one></two>
                `);
      }).toThrow();
    });
  });

  describe("jsonXmlToXmlString", () => {
    it("should succeed with valid JSON root definition", () => {
      const xml = jsonXmlToXmlString({
        // No name indicates a root node
        elements: [
          {
            type: "element",
            name: "one",
            elements: [
              {
                type: "element",
                name: "two",
              },
            ],
          },
        ],
      });
      expect(xml).toEqual("<one><two/></one>");
    });

    it("should succeed with valid JSON element definition", () => {
      const xml = jsonXmlToXmlString({
        type: "element",
        name: "one",
        elements: [
          {
            type: "element",
            name: "two",
          },
        ],
      });
      expect(xml).toEqual("<one><two/></one>");
    });
  });

  describe("collapseFragments", () => {
    it("should return fragment if top level is fragment", () => {
      const input = {
        type: "element",
        name: "XML_FRAGMENT",
        elements: [],
      };
      expect(collapseFragments(input)).toEqual(input);
    });

    it("should return fragment if top level is fragment (elements undefined)", () => {
      const input = {
        type: "element",
        name: "XML_FRAGMENT",
        elements: undefined,
      };
      expect(collapseFragments(input)).toEqual({
        ...input,
        elements: [],
      });
    });
    it("with fragments", () => {
      const input = {
        elements: [
          {
            type: "element",
            name: "one",
          },
          {
            type: "element",
            name: "XML_FRAGMENT",
            elements: [
              {
                type: "element",
                name: "XML_FRAGMENT",
                elements: [
                  {
                    type: "element",
                    name: "two",
                    elements: [
                      {
                        type: "text",
                        text: "three",
                      },
                      {
                        type: "element",
                        name: "XML_FRAGMENT",
                        elements: [
                          {
                            type: "text",
                            text: "four",
                          },
                        ],
                      },
                      {
                        type: "element",
                        name: "XML_FRAGMENT",
                      },
                      {
                        type: "element",
                        elements: [
                          {
                            type: "text",
                            text: "five",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      const inputClone = JSON.parse(JSON.stringify(input));
      const out = collapseFragments(input);
      expect(inputClone).toEqual(input);
      expect(input.elements[1]!.elements![0]!.elements[0]?.elements[3]).toBe(
        out.elements![1]!.elements![2],
      );
      expect(out).toEqual({
        elements: [
          {
            type: "element",
            name: "one",
          },
          {
            type: "element",
            name: "two",
            elements: [
              {
                type: "text",
                text: "three",
              },
              {
                type: "text",
                text: "four",
              },
              {
                type: "element",
                elements: [
                  {
                    type: "text",
                    text: "five",
                  },
                ],
              },
            ],
          },
        ],
      });
    });

    it("without fragments should not mutate", () => {
      const input = {
        type: "element",
        name: "foo",
        elements: [
          {
            type: "element",
            name: "bar",
            elements: [
              {
                type: "text",
                text: "hello",
              },
            ],
          },
        ],
      };
      const out = collapseFragments(input);
      expect(out).toBe(input);
    });
  });

  describe("createFragment", () => {
    it("should return fragment", () => {
      const out = createFragment([]);
      expect(out).toEqual({
        type: "element",
        name: "XML_FRAGMENT",
        elements: [],
      });
    });
  });

  describe("cdata", () => {
    it("should return correct format", () => {
      expect(cdata("testing")).toEqual(`<![CDATA[testing]]>`);
    });
  });

  describe("cdata", () => {
    it("valid should return correct format", () => {
      expect(cdataJson({ type: "text", text: "hello" })).toEqual({
        type: "cdata",
        cdata: "hello",
      });
    });

    it("invalid should throw", () => {
      expect(() => cdataJson({ type: "w:t", elements: [] })).toThrow(
        "Expecting text node",
      );
    });
  });

  describe("safeXml", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = {
        ...originalEnv,
        NODE_ENV: "development",
      };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("string", () => {
      const element = safeXml`<test>${"testing"}</test>`;
      expect(element).toEqual("<test>testing</test>");
    });

    it("number", () => {
      const element = safeXml`<test>${1234}</test>`;
      expect(element).toEqual("<test>1234</test>");
    });

    it("string[]", () => {
      const element = safeXml`<test>${["a", "b", "c"]}</test>`;
      expect(element).toEqual("<test>abc</test>");
    });

    it("number[]", () => {
      const element = safeXml`<test>${[1, 2, 3]}</test>`;
      expect(element).toEqual("<test>123</test>");
    });

    it("throws in development", () => {
      expect(() => {
        safeXml`<test>${"testing"}</testing>`;
      }).toThrow();
    });
  });

  it.skip("xmlCompact", () => {
    const element = xmlCompact(`
      <test>
        ${"testing"}
      </test>
    `);
    expect(element).toEqual("<test>testing</test>");
  });
});
