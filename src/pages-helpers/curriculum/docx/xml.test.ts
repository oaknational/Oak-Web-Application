import { jsonXmlToXmlString, xmlElementToJson, xmlRootToJson } from "./xml";

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
    it("should succeed with valid JSON definition", () => {
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
});
