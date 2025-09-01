import {
  headingPortableText,
  subheadingPortableText,
  bodyPortableText,
  bodyPortableTextWithStyling,
} from "./portableText";

describe("headingPortableText", () => {
  it("should return a PortableText block with default heading text", () => {
    const result = headingPortableText();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      _type: "block",
      style: "heading2",
      _key: "banner-heading-key",
      markDefs: [],
      children: [
        {
          marks: [],
          text: "Transform Your Teaching with Oak Resources",
          _key: "banner-heading-text",
          _type: "span",
        },
      ],
    });
  });

  it("should return a PortableText block with custom heading text", () => {
    const customText = "Custom Heading Text";
    const result = headingPortableText(customText);

    expect(result).toHaveLength(1);
    expect(result[0]?.children[0]?.text).toBe(customText);
    expect(result[0]?.style).toBe("heading2");
  });

  it("should have the correct structure for heading2 style", () => {
    const result = headingPortableText();

    expect(result[0]?._type).toBe("block");
    expect(result[0]?.style).toBe("heading2");
    expect(result[0]?._key).toBe("banner-heading-key");
    expect(result[0]?.markDefs).toEqual([]);
    expect(result[0]?.children).toHaveLength(1);
  });
});

describe("subheadingPortableText", () => {
  it("should return a PortableText block with default subheading text", () => {
    const result = subheadingPortableText();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      _type: "block",
      style: "heading3",
      _key: "banner-subheading-key",
      markDefs: [],
      children: [
        {
          marks: [],
          text: "Expert-made resources for every lesson",
          _key: "banner-subheading-text",
          _type: "span",
        },
      ],
    });
  });

  it("should return a PortableText block with custom subheading text", () => {
    const customText = "Custom Subheading Text";
    const result = subheadingPortableText(customText);

    expect(result).toHaveLength(1);
    expect(result[0]?.children[0]?.text).toBe(customText);
    expect(result[0]?.style).toBe("heading3");
  });

  it("should have the correct structure for heading3 style", () => {
    const result = subheadingPortableText();

    expect(result[0]?._type).toBe("block");
    expect(result[0]?.style).toBe("heading3");
    expect(result[0]?._key).toBe("banner-subheading-key");
    expect(result[0]?.markDefs).toEqual([]);
    expect(result[0]?.children).toHaveLength(1);
  });
});

describe("bodyPortableText", () => {
  it("should return a PortableText block with default body text", () => {
    const result = bodyPortableText();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      children: [
        {
          text: "Discover comprehensive curriculum resources designed by education experts to support your teaching and save you time. From lesson plans to interactive activities, we've got everything you need for engaging classroom experiences.",
          _key: "banner-body-text",
          _type: "span",
          marks: [],
        },
      ],
      _type: "block",
      style: "normal",
      _key: "banner-body-key",
      markDefs: [],
    });
  });

  it("should return a PortableText block with custom body text", () => {
    const customText = "This is custom body text for testing purposes.";
    const result = bodyPortableText(customText);

    expect(result).toHaveLength(1);
    expect(result[0]?.children[0]?.text).toBe(customText);
    expect(result[0]?.style).toBe("normal");
  });

  it("should have the correct structure for normal style", () => {
    const result = bodyPortableText();

    expect(result[0]?._type).toBe("block");
    expect(result[0]?.style).toBe("normal");
    expect(result[0]?._key).toBe("banner-body-key");
    expect(result[0]?.markDefs).toEqual([]);
    expect(result[0]?.children).toHaveLength(1);
  });
});

describe("bodyPortableTextWithStyling", () => {
  it("should return PortableText blocks with default styled text", () => {
    const result = bodyPortableTextWithStyling();

    expect(result).toHaveLength(2);

    // First block with strong styling
    expect(result[0]).toEqual({
      _key: "styled-body-1",
      markDefs: [],
      children: [
        {
          _key: "styled-span-1",
          _type: "span",
          marks: ["strong"],
          text: "Expert-designed",
        },
        {
          _type: "span",
          marks: [],
          text: " resources that make teaching easier and more effective.",
          _key: "styled-span-2",
        },
      ],
      _type: "block",
      style: "normal",
    });

    // Second block without styling
    expect(result[1]).toEqual({
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "With complete curriculum coverage across all subjects, Oak provides the planning power behind great classroom teaching.",
          _key: "styled-span-3",
        },
      ],
      _type: "block",
      style: "normal",
      _key: "styled-body-2",
    });
  });

  it("should return PortableText blocks with custom styled text", () => {
    const customStyledText1 = "Custom strong text";
    const customStyledText2 = " and regular text.";
    const customStyledText3 = "This is the second paragraph.";

    const result = bodyPortableTextWithStyling(
      customStyledText1,
      customStyledText2,
      customStyledText3,
    );

    expect(result).toHaveLength(2);

    // First block
    expect(result[0]?.children[0]?.text).toBe(customStyledText1);
    expect(result[0]?.children[0]?.marks).toEqual(["strong"]);
    expect(result[0]?.children[1]?.text).toBe(customStyledText2);
    expect(result[0]?.children[1]?.marks).toEqual([]);

    // Second block
    expect(result[1]?.children[0]?.text).toBe(customStyledText3);
    expect(result[1]?.children[0]?.marks).toEqual([]);
  });
});
